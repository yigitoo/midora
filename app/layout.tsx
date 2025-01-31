import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Navbar from "./components/Navbar"
import { ThemeProvider } from "./components/ThemeProvider"
import { AuthProvider } from "./components/AuthProvider"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Midora - Finansal Hizmetler",
  description: "Forum bölümleri, ünlü portföyleri ve profil sistemi ile bir finansal hizmet web sitesi.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main>{children}</main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
