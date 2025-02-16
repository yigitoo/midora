"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import useSidebar from "@/hooks/useSidebar";
import { IMAGE_URL } from "@/lib/urls";
import { AuthProvider } from "../services/AuthProvider";
import { ThemeProvider } from "../components/ThemeProvider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, isCollapsed, toggleOpen } = useSidebar();

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href={IMAGE_URL.logoUrl} sizes="any" />
        <link
          rel="icon"
          href={IMAGE_URL.logoUrl}
          type="image/jpeg"
          sizes="any"
        />
        <link
          rel="apple-touch-icon"
          href={IMAGE_URL.logoUrl}
          type="image/jpeg"
          sizes="any"
        />
        <title>
          💸Midora - Finansal Hizmetler
        </title>
      </head>
      <body className={inter.className + ' bg-secondary'}>
        <AuthProvider>
          <ThemeProvider>
            <Navbar toggleSidebar={toggleOpen} />
            <Sidebar isOpen={isOpen} />
            <main
              className={cn(
                "md:ml-0 transition-all duration-300 ease-in-out",
                isOpen
                  ? isCollapsed
                    ? "ml-5 md:ml-16 md:w-[calc(100vw - 4rem)] lg:w-[calc(100vw - 16rem)]"
                    : "ml-16md:w-[calc(100vw - 4rem)] lg:w-[calc(100vw - 16rem)]"
                  : "ml-0 w-full"
              )}
            >
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
