'use client'

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../components/ThemeProvider";
import { AuthProvider } from "./services/AuthProvider";
import type React from "react";
import { IMAGE_URL } from "@/lib/urls";
import Sidebar from '../components/Sidebar';
import { useState } from 'react';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href={IMAGE_URL.logoUrl} sizes="any" />
        <link rel="icon" href={IMAGE_URL.logoUrl} type="image/jpeg" sizes="any" />
        <link rel="apple-touch-icon" href={IMAGE_URL.logoUrl} type="image/jpeg" sizes="any" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen flex">
              <Navbar toggleSidebar={toggleSidebar} />
              <Sidebar isOpen={isSidebarOpen} />
              <main className={`flex-1 pt-24 transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : ""}`}>
                {children}
              </main>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

/*
export const metadata: Metadata = {
  title: "Midora - Finansal Hizmetler",
  description:
    "Form bölümleri, ünlü portföyleri ve profil sistemi ile bir finansal hizmet web sitesi.",
};

*/
