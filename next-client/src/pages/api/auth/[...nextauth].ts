import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import SlackProvider from "next-auth/providers/slack";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import vercelPostgresAdapter from "@/lib/vercelPostgresAdapter";

// adapter: FirestoreAdapter({
//   credential: cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY
//       ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
//       : undefined,
//   }),
// }),

export const authOptions = {
  debug: true,
  secret: process.env.NEXT_AUTH as string,
  adapter: vercelPostgresAdapter(),
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
    }),
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
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    SlackProvider({
      clientId: process.env.SLACK_ID as string,
      clientSecret: process.env.SLACK_SECRET as string,
    }),
  ],
};

export default NextAuth(authOptions);
