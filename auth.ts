import NextAuth from "next-auth";

import client from "./src/utils/mongodb";
import google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [google],

  callbacks: {
    async signIn({ user }) {
      try {
        const result = await client
          .db("pure-aura-harvest")
          .collection("users")
          .findOne({ email: user?.email });
        return !!result;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },
  },
});
