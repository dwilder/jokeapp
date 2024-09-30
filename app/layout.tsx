import type { Metadata } from "next";
import { Jost } from 'next/font/google';
import { Spicy_Rice } from 'next/font/google';
import "./globals.css";
import Header from "./components/header";

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost'
});

const spicyRice = Spicy_Rice({
  subsets: ['latin'],
  variable: '--font-spicyrice',
  weight: "400",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Tell Me a Joke",
  description: "A NextJS app for telling jokes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jost.variable} ${spicyRice.variable} antialiased`}
      >
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}
