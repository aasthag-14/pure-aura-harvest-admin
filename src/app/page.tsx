// "use client";
// import Admin from "@/components/Admin";
// import Login from "@/components/Login";
import React from "react";
// import { auth } from "../../auth";
import Admin from "@/components/Admin";
// import { useSession } from "next-auth/react";

export default async function Home() {
  // const session = useSession();

  // console.log(session);
  // const isLoggedIn = session.status !== "unauthenticated";

  // const session = await auth();

  // console.log(session);
  return (
    <main className="p-10">
      <h1 className="font-bold text-center text-4xl">Admin</h1>
      {/* <Login /> */}
      <Admin />
      {/* {isLoggedIn && <Admin />}
      {!isLoggedIn && <Login />} */}
    </main>
  );
}
