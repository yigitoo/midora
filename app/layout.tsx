import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./services/AuthProvider";
import type React from "react"; // Added import for React

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Midora - Finansal Hizmetler",
  description:
    "Form bölümleri, ünlü portföyleri ve profil sistemi ile bir finansal hizmet web sitesi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/midora_log.png" sizes="any" />
        <link
          rel="icon"
          href="/images/midora_logo.jpg"
          type="image/jpeg"
          sizes="any"
        />
        <link
          rel="apple-touch-icon"
          href="/images/midora_logo.jpg"
          type="image/jpeg"
          sizes="any"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen">
              <Navbar />
              <main className="pt-16">{children}</main>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
