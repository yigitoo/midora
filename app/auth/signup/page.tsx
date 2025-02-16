"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "../../../services/AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { URL_MAP } from "@/lib/urls"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signup(email, password, name, username)
    } catch (error) {
      setError(error.message)
    }1
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Kayıt Ol</CardTitle>
          <CardDescription>Yeni bir hesap oluşturun</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="İsim"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Kullanıcı Adı"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Kayıt Ol
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link href={URL_MAP.loginPage} className="text-sm text-primary hover:underline">
              Zaten hesabınız var mı? Giriş yapın
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
