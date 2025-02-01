"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  isLoggedIn: boolean
  user: any
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()

  const defaultAfterLoginPath = '/';
  const defaultAfterSignupPath = '/';
  const defaultAfterLogoutPath = '/login';

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUserData(token)
    }
  }, [])

  const fetchUserData = async (token: string) => {
    try {
      const res = await fetch('/api/auth/user', {
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error('Login failed')

      const data = await res.json()
      localStorage.setItem('token', data.token)
      setUser(data.user)
      setIsLoggedIn(true)
      router.push(afterLoginPath)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const signup = async (email: string, password: string, name: string, afterSignupPath: string = defaultAfterSignupPath) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      if (!res.ok) throw new Error('Signup failed')

      const data = await res.json()
      localStorage.setItem('token', data.token)
      setUser(data.user)
      setIsLoggedIn(true)
      router.push(afterSignupPath)
    } catch (error) {
      console.error('Signup error:', error)
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

export const useAuth = () => useContext(AuthContext)
