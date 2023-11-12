import { POST } from "@/app/api/qa-pg-vector/route";
import { X } from "lucide-react";
import NextAuth, { Account, NextAuthOptions, Profile, Session, User } from "next-auth";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";

const appClientID = process.env.REACT_APP_CLIENT_ID;
const appClientSecret = process.env.REACT_APP_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/",
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
  callbacks: {
    jwt: async (user) => {
      return user;
    },
    session: async ({ session, token }): Promise<Session> => {
      return session;
    },
  },
  secret: nextAuthSecret as string,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#create-a-repository-for-the-authenticated-user
