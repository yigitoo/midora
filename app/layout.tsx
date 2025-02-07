"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import useSidebar from "@/hooks/useSidebar";
import { IMAGE_URL } from "@/lib/urls";
import { AuthProvider } from "./services/AuthProvider";
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
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <Navbar toggleSidebar={toggleOpen} />
            <Sidebar isOpen={isOpen} />
            <main
              className={cn(
                "md:ml-0 transition-all duration-300 ease-in-out",
                isOpen ? (isCollapsed ? "ml-5" : "ml-16") : "ml-0"
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
