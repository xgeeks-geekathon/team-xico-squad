import { POST } from "@/app/api/qa-pg-vector/route";
import { X } from "lucide-react";
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";
import { generateRepo } from "../../../../../repo-generator-ai/ai-repo-gen";

const appClientID = process.env.REACT_APP_CLIENT_ID;
const appClientSecret = process.env.REACT_APP_CLIENT_SECRET;
const appRedirectURI = process.env.REACT_APP_REDIRECT_URI;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/home", // Redirect users to "/login" when signing in
  },
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: appClientID as string,
      clientSecret: appClientSecret as string,
      authorization: { params: { scope: "public_repo" } },
      profile(profile: GithubProfile) {
        console.log("profile", profile);

        return {
          id: profile.id.toString(),
          name: profile.name,
          userName: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  events: {
    signIn: async (message) => {
      console.log("events signIn");
      generateRepo({
        gitHubCredentials: {
          username: message?.profile?.name ?? "",
          token: message?.account?.accessToken ?? "",
        },
        templateName: "react-ts",
        newRepoName: "cavalo",
        openAiKey: process.env.OPENAI_KEY ?? "",
      });
    },
    signOut: async (message) => {
      console.log("signOut");
    },
  },
  callbacks: {
    jwt: async (user) => {
      return user;
    },
    session: async ({ session, token }) => {
      return { session, token };
    },
  },
  secret: nextAuthSecret as string,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#create-a-repository-for-the-authenticated-user
