import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import SlackProvider from "next-auth/providers/slack";
import customAuthAdapter from "@/lib/nextAuth/customAuthAdapter";
import CredentialsProvider from "next-auth/providers/credentials";
import validatePassword from "@/lib/nextAuth/validatePassword";

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
    }),
    SlackProvider({
      clientId: process.env.SLACK_ID as string,
      clientSecret: process.env.SLACK_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      //this does not do anything, just for the ts types
      name: "Credentials",
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      //down to here
      async authorize(credentials: any) {
        console.log("credentials", credentials);
        if (!credentials || !credentials.email || !credentials.password)
          return null;

        const user = await validatePassword({
          email: credentials.email,
          password: credentials.password,
        });
        if (!user) return null;

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
    signOut: "/profile",
    error: "/error",
    verifyRequest: "/verify-email",
    newUser: "/newUser",
  },
  callbacks: {
    async redirect() {
      return "/dashboard";
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
