"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Kayıt Ol</CardTitle>
          <CardDescription>Yeni bir hesap oluşturun</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">İsim</Label>
              <Input id="name" placeholder="Yiğit GÜMÜŞ" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
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
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Kayıt ol
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Zaten hesabın var mı?
              <Link href="/login" className="text-primary hover:underline ml-1">
                Giriş yap
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
