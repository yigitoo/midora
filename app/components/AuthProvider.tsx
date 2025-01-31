"use client"

import { useRouter } from "next/router"
import type React from "react"
import { createContext, useContext, useState } from "react"

type AuthContextType = {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const login = () => setIsLoggedIn(true)
  const logout = () => {setIsLoggedIn(false); router.push('/')}

  return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

