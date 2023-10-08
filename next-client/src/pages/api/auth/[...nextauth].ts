import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import SlackProvider from "next-auth/providers/slack";
import customAuthAdapter from "@/lib/nextAuth/customAuthAdapter";
import CredentialsProvider from "next-auth/providers/credentials";
import validatePassword from "@/lib/nextAuth/valitatePassword";

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
      name: "Credentials",
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.username || !credentials.password)
          return null;

        const user = await validatePassword({
          email: credentials.username,
          password: credentials.password,
        });
        if (!user) return null;

        return user;
      },
    }),
  ],
  debugger: true,
  callbacks: {
    async redirect() {
      return "/dashboard";
    },
  },
};

export default NextAuth(authOptions);
