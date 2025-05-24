import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { AuthProvider } from "@/lib/auth-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Navbar } from "@/components/ui/navbar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Midora - Financial Analysis Platform",
  description: "Professional stock market analysis with watchlists, screener, and technical indicators",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
              <SidebarProvider>
                <div className="min-h-screen bg-background flex w-full px-5">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <Navbar />
                    <main className="flex-1">{children}</main>
                  </div>
                </div>
                <Toaster />
              </SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
