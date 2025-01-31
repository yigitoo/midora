"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/compat/router";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter()

  const logout_btn = () => {
    logout();
    router?.push('/')

  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="font-bold text-xl">💸Midora</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/forum" className="nav-link">Forum</Link>
            <Link href="/portfolios" className="nav-link">Portfolios</Link>
            <Link href="/about" className="nav-link">Hakkımızda</Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Button variant="secondary" asChild><Link href="/profile">Profil</Link></Button>
                <Button variant="destructive" onClick={logout}>Çıkış yap</Button>
              </>
            ) : (
              <>
                <Button variant="secondary" asChild><Link href="/login">Giriş yap</Link></Button>
                <Button asChild><Link href="/signup">Kayıt ol</Link></Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col items-start">
              <Link href="/forum" className="mobile-nav-link">Forum</Link>
              <Link href="/portfolios" className="mobile-nav-link">Portfolios</Link>
              <Link href="/about" className="mobile-nav-link">Hakkımızda</Link>
              <hr className="w-full border-primary-foreground" />
              {isLoggedIn ? (
                <>
                  <Link href="/profile" className="mobile-nav-link">Profil</Link>
                  <button onClick={logout_btn} className="mobile-nav-link w-full text-left text-white bg-red-500">Çıkış yap</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="mobile-nav-link">Giriş yap</Link>
                  <Link href="/signup" className="mobile-nav-link">Kayıt ol</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
