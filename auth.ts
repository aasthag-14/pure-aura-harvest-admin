// "use server";
// import dayjs from "dayjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// import client from "./src/utils/mongodb";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = {
          id: "1",
          name: "Aastha Gupta",
          email: "aastha1406@gmail.com",
          password: "123",
        };

        if (
          credentials?.email === "aastha1406@gmail.com" &&
          credentials?.password === "123"
        ) {
          return user;
        }

        return null;
      },
    }),
  ],
  // callbacks: {
  //   async signIn({ user }) {
  //     try {
  //       // const subscription = {
  //       //   plan: "free",
  //       //   updatedAt: dayjs().unix(),
  //       // };

  //       // create a new user if it doesn't exist
  //       await client
  //         .db("pure-aura-harvest")
  //         .collection("users")
  //         .updateOne(
  //           { email: user?.email },
  //           {
  //             $setOnInsert: {
  //               name: user?.name,
  //               email: user?.email,
  //               // subscription,
  //               createdAt: dayjs().unix(),
  //             },
  //           }, // set only if the document is being inserted
  //           { upsert: true } // insert if not found
  //         );

  //       return true;
  //     } catch (error) {
  //       console.error(error);
  //       return false;
  //     }
  //   },
  // },
});
