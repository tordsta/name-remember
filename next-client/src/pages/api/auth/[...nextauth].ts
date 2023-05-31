import NextAuth, { User } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import SlackProvider from "next-auth/providers/slack";
import vercelPostgresAdapter from "@/utils/vercelPostgresAdapter";
import sendVerificationMail from "@/components/mail/sendVerificationMail";

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
  callbacks: {
    async redirect() {
      return "/dashboard";
    },
  },
  //TODO - add email verification
  // events : {
  //   async createUser(message: { user: User}) {
  //     console.log("createUser", message);
  //     //create token
  //     sendVerificationMail({
  //       recipientEmail: message.user.email as string,
  //       recipientName: message.user.name as string,
  //       tokenUrl: "",
  //     });
  //   }
  // }
};

export default NextAuth(authOptions);
