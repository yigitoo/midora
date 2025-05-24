"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Menu } from "lucide-react"
import { useAuth } from "@/services/AuthProvider"
import { usePathname } from "next/navigation"
import { IMAGE_URL, URL_MAP } from "@/lib/urls"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type React from "react"

interface NavbarProps {
  toggleSidebar: () => void
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isLoggedIn, logout, user } = useAuth()
  const pathname = usePathname()

  const navbarHeight = "h-24"
  const mobileMenuHeight = "max-h-[400px]"

  const siteLogoPath = IMAGE_URL.logoUrl

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <nav className="fixed w-full top-0 z-50 glass-effect backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`flex items-center justify-between ${navbarHeight}`}>
            {/* Logo */}
            <div className="flex items-center">
              <Link href={URL_MAP.homePage} className="flex-shrink-0">
                <span className="flex items-center font-bold text-xl">
                  <Image
                    className="mx-3 rounded-full animate-pulse-glow"
                    width={70}
                    height={70}
                    src={siteLogoPath || "/placeholder.svg"}
                    alt="midora"
                  />
                  <span className="gradient-text text-2xl font-bold">Midora</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href={URL_MAP.forumPage} className="nav-link hover:opacity-80 transition-opacity px-3 py-2">
                Forum
              </Link>
              <Link href={URL_MAP.portfoliosPage} className="nav-link hover:opacity-80 transition-opacity px-3 py-2">
                Portfolios
              </Link>
              <Link href={URL_MAP.stockViewPage} className="nav-link hover:opacity-80 transition-opacity px-3 py-2">
                Stocks
              </Link>
              <Link href={URL_MAP.aboutPage} className="nav-link hover:opacity-80 transition-opacity px-3 py-2">
                About
              </Link>

              {/* Desktop Search */}
              <div className="relative flex items-center ml-4">
                <div
                  className={cn(
                    "flex items-center transition-all duration-300 ease-in-out",
                    isSearchExpanded ? "w-[275px]" : "w-10",
                  )}
                >
                  <Input
                    type="search"
                    placeholder="Search..."
                    className={cn(
                      "pr-8 transition-all duration-300 glass-effect",
                      !isSearchExpanded && "opacity-0 w-0 p-0",
                    )}
                    onFocus={() => setIsSearchExpanded(true)}
                    onBlur={() => setIsSearchExpanded(false)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-primary"
                    onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                  >
                    {isSearchExpanded ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Desktop Auth */}
              {isLoggedIn && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage src={`${IMAGE_URL.randomAvatarGenerator}${user.username}`} alt={user.username} />
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={URL_MAP.profilePage}>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`${URL_MAP.userProfilePage}/${user.username}`}>Public Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={URL_MAP.portfoliosPage}>My Portfolio</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => logout()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href={URL_MAP.loginPage}>
                    <Button variant="ghost" className="nav-link hover:opacity-80 transition-opacity px-3 py-2">
                      Log in
                    </Button>
                  </Link>
                  <Link href={URL_MAP.signUpPage}>
                    <Button className="bg-gradient-vibrant hover:opacity-90 transition-opacity">Sign up</Button>
                  </Link>
                </div>
              )}

              {/* Sidebar Toggle */}
              <Button variant="ghost" size="icon" className="text-primary" onClick={toggleSidebar}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={cn(
              "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
              isMobileMenuOpen ? mobileMenuHeight : "max-h-0",
            )}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href={URL_MAP.forumPage}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/20 transition-colors"
              >
                Forum
              </Link>
              <Link
                href={URL_MAP.portfoliosPage}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/20 transition-colors"
              >
                Portfolios
              </Link>
              <Link
                href={URL_MAP.stockViewPage}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/20 transition-colors"
              >
                Stocks
              </Link>
              <Link
                href={URL_MAP.aboutPage}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/20 transition-colors"
              >
                About
              </Link>

              <div className="my-4 h-0.5 rounded-lg bg-gradient-vibrant" />

              {/* Mobile Auth */}
              {isLoggedIn ? (
                <>
                  <Link
                    href={URL_MAP.profilePage}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/20 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href={`${URL_MAP.userProfilePage}/${user?.username}`}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/20 transition-colors"
                  >
                    Public Profile
                  </Link>
                  <button
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                    onClick={() => logout()}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={URL_MAP.loginPage}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/20 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href={URL_MAP.signUpPage}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-vibrant text-white hover:opacity-90 transition-opacity"
                  >
                    Sign up
                  </Link>
                </>
              )}

              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <Input type="search" placeholder="Search..." className="w-full glass-effect" />
                  <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 text-primary">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer div to prevent content from going under navbar */}
      <div className={navbarHeight}></div>
    </>
  )
}

export default Navbar
