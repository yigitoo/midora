"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./ThemeToggle"
import { useAuth } from "./AuthProvider"

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth()

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="font-bold text-xl">Midora</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/forum"
                  className="hover:bg-primary/90 hover:text-primary-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Forum
                </Link>
                <Link
                  href="/portfolios"
                  className="hover:bg-primary/90 hover:text-primary-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Portfolios
                </Link>
                {isLoggedIn && (
                  <Link
                    href="/profile"
                    className="hover:bg-primary/90 hover:text-primary-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <ThemeToggle />
              {isLoggedIn ? (
                <>
                  <Button variant="secondary" asChild className="ml-2">
                    <Link href="/settings">Settings</Link>
                  </Button>
                  <Button variant="outline" onClick={logout} className="ml-2">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" asChild className="ml-2">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="ml-2">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

