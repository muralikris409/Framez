import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import StoreProvider from "./StoreProvider";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { SessionProvider } from "next-auth/react";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` bg-gray-50 ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <SessionProvider>

        <StoreProvider>
        {children}

        <ToastContainer/>

        </StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
