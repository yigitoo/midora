"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/app/components/ui/card"
import { useAuth } from "@/services/AuthProvider"
import { URL_MAP } from "@/lib/urls"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, isLoggedIn, user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch (error) {
      setError(error.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.")
    }
  }

  setTimeout(() => {
    if(isLoggedIn && user)
    {
      router.push(URL_MAP.homePage)
    }
  }, 1000)

  return (
    <div className="container mx-auto py-10">
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Giriş Yap</CardTitle>
          <CardDescription>Hesabınıza giriş yapın</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="yigit@midora.com.tr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Giriş yap
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Hesabın yok mu?
              <Button type="submit" className="ml-2 hover:underline bg-[#193bc2] text-primary-foreground hover:bg-primary/90">
                Kayıt ol!
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
