"use client";
import { signIn, useSession } from "next-auth/react";
import React from "react";

const Login = () => {
  const { status } = useSession();

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center mx-auto p-8 rounded-lg bg-gray-100 w-fit shadow-md">
      <span className="text-base font-medium">Essence and Harvest</span>
      <h3 className="text-xl font-bold">Admin Portal</h3>
      <button
        onClick={() =>
          signIn("google", {
            callbackUrl: "/",
          })
        }
        className="btn-primary"
      >
        Sign In
      </button>
    </div>
  );
};

export default Login;
