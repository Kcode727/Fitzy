'use client';

import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Shrikhand, Plus_Jakarta_Sans, DM_Serif_Display } from 'next/font/google';
import "./globals.css";
import Navbar from "../components/Navbar";

const shrikhand = Shrikhand({
  variable: '--font-shrikhand',
  subsets: ['latin'],
  weight: '400',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
});

const metadata: Metadata = {
  title: "Fitzy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${shrikhand.variable} ${plusJakarta.variable} ${dmSerif.variable}`}>
      <body className="bg-black text-white font-sans">
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
