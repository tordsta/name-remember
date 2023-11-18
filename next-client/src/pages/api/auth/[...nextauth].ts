import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import SlackProvider from "next-auth/providers/slack";
import customAuthAdapter from "@/lib/nextAuth/customAuthAdapter";
import CredentialsProvider from "next-auth/providers/credentials";
import validatePassword from "@/lib/nextAuth/validatePassword";
import validateCredentialsUser from "@/lib/nextAuth/validateCredentialsUser";

export const authOptions = {
  secret: process.env.NEXT_AUTH as string,
  adapter: customAuthAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
    SlackProvider({
      clientId: process.env.NEXT_PUBLIC_SLACK_ID as string,
      clientSecret: process.env.SLACK_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials: any) {
        if (!credentials || !credentials.email || !credentials.password)
          return { error: "Missing credentials." } as any;

        const userExists = await validateCredentialsUser({
          email: credentials.email,
        });
        if (typeof userExists === "string") return { error: userExists } as any;

        const user = await validatePassword({
          email: credentials.email,
          password: credentials.password,
        });
        if (!user) return { error: "Wrong password." } as any;

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debugger: false,
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    verifyRequest: "/",
    newUser: "/",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      if (user?.error) {
        throw new Error(user.error);
      }
      return true;
    },
    async redirect() {
      return `${process.env.NEXTAUTH_URL}/dashboard`;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.user = { ...user };
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token?.user) {
        session.user = token.user;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions as any);
