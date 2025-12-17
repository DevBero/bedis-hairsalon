import { AuthOptions } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import { GroupType } from "../entities/user-group";

export const authOptions: AuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER!,
      authorization: { params: { lang: "de" } },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.groups =
          (profile as Record<string, unknown>)["cognito:groups"] || [];
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.groups) {
        session.user.groups = token.groups as GroupType[];
        session.user.sub = token.sub || "unknown";
      }
      return session;
    },
  },
};
