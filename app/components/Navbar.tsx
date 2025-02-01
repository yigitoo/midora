"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Menu } from "lucide-react";
import { useAuth } from "../services/AuthProvider";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, logout, user } = useAuth();
  const pathname = usePathname();

  const navbarHeight = "h-24"; // Define navbar height
  const mobileMenuHeight = "max-h-[400px]";

  const siteLogoPath = "/images/midora_logo.jpg";

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const AuthButtons = () =>
    isLoggedIn ? (
      <div className="flex items-center space-x-4">
        <Link href="/profile">
          <Button variant="ghost" className="text-white hover:text-gray-300">
            {user?.username || user?.name || "Profil"}
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="bg-red-500 block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-red-700 text-white transition-colors"
          onClick={() => {
            logout();
          }}
        >
          Çıkış yap
        </Button>
      </div>
    ) : (
      <div className="flex items-center space-x-4">
        <Link href="/login">
          <Button variant="ghost" className="text-white hover:text-gray-300">
            Giriş yap
          </Button>
        </Link>
        <Link href="/signup">
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
            Kayıt ol
          </Button>
        </Link>
      </div>
    );

  const MobileAuthButtons = () =>
    isLoggedIn ? (
      <>
        <Link
          href="/profile"
          className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-colors"
        >
          {user?.name || "Profil"}
        </Link>
        <button
          className="bg-red-500 block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-red-700 text-white transition-colors"
          onClick={() => logout()}
        >
          Çıkış yap
        </button>
      </>
    ) : (
      <>
        <Link
          href="/login"
          className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-colors"
        >
          Giriş yap
        </Link>
        <Link
          href="/signup"
          className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-colors"
        >
          Kayıt ol
        </Link>
      </>
    );

  return (
    <>
      <nav
        style={{
          backgroundColor: "#1a202c",
          color: "white",
          borderBottom: "3px solid var(--color-primary-foreground)",
          zIndex: 99999,
        }}
        className="navbar-bg-secondary text-secondary-foreground shadow-md fixed w-full top-0"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className={`flex items-center justify-between ${navbarHeight}`}>
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <span className="flex items-center font-bold text-xl">
                  <Image className="mx-3" style={{
                    borderRadius: "50%",
                    border: "2px solid var(--color-primary-foreground)"
                  }} width={70} height={70} src={siteLogoPath} alt="midora" />
                  Midora
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/forum"
                className="nav-link hover:opacity-80 transition-opacity px-3 py-2"
              >
                Forum
              </Link>
              <Link
                href="/portfolios"
                className="nav-link hover:opacity-80 transition-opacity px-3 py-2"
              >
                Portfolios
              </Link>
              <Link
                href="/about"
                className="nav-link hover:opacity-80 transition-opacity px-3 py-2"
              >
                Hakkımızda
              </Link>

              {/* Desktop Search */}
              <div className="relative flex items-center ml-4">
                <div
                  className={cn(
                    "flex items-center transition-all duration-300 ease-in-out",
                    isSearchExpanded ? "w-[275px]" : "w-10"
                  )}
                >
                  <Input
                    type="search"
                    placeholder="Search..."
                    className={cn(
                      "pr-8 transition-all duration-300 bg-gray-700 border-gray-600",
                      !isSearchExpanded && "opacity-0 w-0 p-0"
                    )}
                    onFocus={() => setIsSearchExpanded(true)}
                    onBlur={() => setIsSearchExpanded(false)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-300"
                    onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                  >
                    {isSearchExpanded ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Desktop Auth */}
              <AuthButtons />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300"
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
              isMobileMenuOpen ? mobileMenuHeight : "max-h-0"
            )}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/forum"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-colors"
              >
                Forum
              </Link>
              <Link
                href="/portfolios"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-colors"
              >
                Portfolios
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-colors"
              >
                Hakkımızda
              </Link>

              <hr style={{ marginTop: "10px", marginBottom: "10px" }} />

              {/* Mobile Auth */}
              <MobileAuthButtons />

              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full bg-gray-700 border-gray-600"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-300"
                  >
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
  );
};

export default Navbar;
