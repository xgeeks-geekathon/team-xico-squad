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
      const { token, account } = user;
      if (account) {
        // Save the access token and refresh token in the JWT on the initial login
        return {
          ...user,
          token: {
            access_token: account.access_token,
            expires_at: Math.floor(Date.now() / 1000 + account.expires_in),
            refresh_token: account.refresh_token,
          },
        };
      } else if (Date.now() < token.expires_at * 1000) {
        // If the access token has not expired yet, return it
        return { ...user, token };
      } else {
        // If the access token has expired, try to refresh it
        try {
          const response = await fetch("https://github.com/login/oauth/access_token", {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.REACT_APP_CLIENT_ID,
              client_secret: process.env.REACT_APP_CLIENT_SECRET,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token,
            }),
            method: "POST",
          });

          const tokens = await response.json();

          if (!response.ok) throw tokens;

          return {
            ...user,
            token: {
              ...token, // Keep the previous token properties
              access_token: tokens.access_token,
              expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
              // Fall back to old refresh token, but note that
              // many providers may only allow using a refresh token once.
              refresh_token: tokens.refresh_token ?? token.refresh_token,
            },
          };
        } catch (error) {
          console.error("Error refreshing access token", error);
          // The error property will be used client-side to handle the refresh token error
          return {
            ...user,
            token: { ...token, error: "RefreshAccessTokenError" as const },
          };
        }
      }
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
