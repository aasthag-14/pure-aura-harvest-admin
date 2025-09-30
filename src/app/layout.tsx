import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import FontLocal from "next/font/local";
import "./globals.css";
import { Footer } from "@/components/common/Footer";
import { SessionProvider } from "next-auth/react";
import { headers } from "next/headers";
import { auth } from "../../auth";
import { Header } from "@/components/common/Header";

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
  const hdrs = await headers();
  hdrs.get("cookie");
  hdrs.get("x-forwarded-proto");
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${rinstonia.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <Header />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
