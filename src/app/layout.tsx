import "../styles/globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Petsoft - Pet daycare software",
  description: "Take care of people's pets responsibly with PetSoft.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} text-sm text-zinc-900 bg-[#E5E8EC] min-h-screen`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
