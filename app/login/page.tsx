"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useAuth } from "../components/AuthProvider"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the login logic
    console.log("Login attempt with:", { email, password })
    login() // Mock login
    router.push("/profile") // Redirect to settings page after login
  }

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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Giriş yap
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Hesabın yok mu?
              <Link href="/signup" className="text-primary hover:text-primary/90 underline ml-1">
                Kayıt ol
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
