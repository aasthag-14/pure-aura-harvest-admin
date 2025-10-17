import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import FontLocal from "next/font/local";
import { auth } from "../../auth";
import SessionProvider from "../providers/SessionProvider";
import "./globals.css";
import Login from "@/components/Login";

export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const rinstonia = FontLocal({
  src: "../fonts/rinstonia-regular.ttf",
  variable: "--font-rinstonia",
});

export const metadata: Metadata = {
  title: "Essence And Harvest",
  icons: "/favicon.ico",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const email = session?.user?.email;

  const isLoggedIn = Boolean(email);
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${rinstonia.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <div className="flex flex-col justify-between min-h-screen">
            <Header />
            {isLoggedIn && children}
            {!isLoggedIn && <Login />}
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
