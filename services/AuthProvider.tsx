"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"
import { URL_MAP, API_URL } from '@/lib/urls'


interface AuthContextType {
  isLoggedIn: boolean
  user: any
  login: (email: string, password: string, afterLoginPath?: string) => Promise<void>
  signup: (email: string, password: string, name: string, username: string, afterSignupPath?: string) => Promise<void>
  logout: (afterLogoutPath?: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth, AuthProvider ile birlikte kullanılmalıdır.')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const { toast } = useToast()

  const defaultAfterLoginPath = URL_MAP.homePage
  const defaultAfterSignupPath = URL_MAP.homePage
  const defaultAfterLogoutPath = URL_MAP.loginPage

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUserData(token)
    }
  }, [])

  const fetchUserData = async (token: string) => {
    try {
      const res = await fetch(API_URL.userAuthApiEndpoint , {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      logout()
    }
  }

  const login = async (email: string, password: string, afterLoginPath: string = defaultAfterLoginPath) => {
    try {
      const res = await fetch(API_URL.loginApiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.status === 403) {
        const suspensionDate = new Date(data.suspendedUntil).toLocaleDateString('tr-TR')
        toast({
          title: "Account Suspended",
          description: `${data.suspensionReason}. Suspended until: ${suspensionDate}`,
          variant: "destructive",
          duration: new Date(data.suspendedUntil).getTime() - Date.now(),
        })
        throw new Error('Hesap Cezalı veya Askıya Alınmış.\nCeza Nedeni: ' + data.suspensionReason + ' | Askıya alınma tarihi: '+ (new Date(data.suspendedAt)).toLocaleDateString('tr-TR') +  ' | Açılacak Tarih: ' + suspensionDate)
      }

      if (!res.ok) {
        throw new Error(data.error || 'Giriş başarısız.')
      }

      localStorage.setItem('token', data.token)
      setUser(data.user)
      setIsLoggedIn(true)
      router.push(afterLoginPath)
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.message !== 'Account suspended') {
        toast({
          title: "Error",
          description: error.message || "Login failed",
          variant: "destructive",
        })
      }
      throw error
    }
  }

  const signup = async (email: string, password: string, name: string, username: string, afterSignupPath: string = defaultAfterSignupPath) => {
    try {
      const res = await fetch(API_URL.signUpApiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, username }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Kayıt başarısız.')
      }

      const data = await res.json()
      localStorage.setItem('token', data.token)
      setUser(data.user)
      setIsLoggedIn(true)
      router.push(afterSignupPath)
    } catch (error) {
      console.error('Kayıt hatası:', error)
      throw error
    }
  }

  const logout = (afterLogoutPath: string = defaultAfterLogoutPath) => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setUser(null)
    router.push(afterLogoutPath)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
