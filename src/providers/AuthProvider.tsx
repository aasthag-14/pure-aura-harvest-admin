"use client";

import axios from "axios";
// import dayjs from "dayjs";
import { useSetAtom } from "jotai";
import { useSession } from "next-auth/react";
import React, { PropsWithChildren, useEffect, useState } from "react";

import { currencyKey } from "../constants/index";

// import service from "@/utils/service";
import { currencyAtom } from "@/data/currency";

export const AuthContext = React.createContext<{
  // hasAccess: boolean;
  loading?: boolean;
}>({
  // hasAccess: false,
});

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const setCurrencyAtom = useSetAtom(currencyAtom);

  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  const isLoggedIn = Boolean(session?.user?.email);
  const email = session?.user?.email;

  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        try {
          setLoading(true);

          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Error loading events from MongoDB:", error);
        }
      })();
    }
  }, [email, isLoggedIn]);

  useEffect(() => {
    if (!(localStorage.getItem(currencyKey) || "")) {
      (async () => {
        try {
          const response = await axios.get("https://ipapi.co/json/");
          const isInr = response.data.currency === "INR";
          setCurrencyAtom(isInr ? response.data.currency : "USD");
        } catch (error) {
          console.error("Error fetching user currency:", error);
          setCurrencyAtom("USD");
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ loading }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
