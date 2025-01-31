"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "../components/ThemeToggle"

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Mock logged in state

  if (!isLoggedIn) {
    // Redirect to login page or show a message
    return <div>Lütfen profilinizi görüntülemek için giriş yapın</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Profilin</CardTitle>
          <CardDescription style={{paddingTop: '10px',fontSize: '15px'}}>Kendi profilini, portföy ve bilgilerini yönetebilmen için hazırladık.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle">Renk Teması</Label>
            <ThemeToggle />
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Ayarlar ve Özellikler</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-primary text-primary-foreground rounded">Kişisel Bilgiler</div>
              <div className="p-4 bg-secondary text-secondary-foreground rounded">Öz geçmiş</div>
              <div className="p-4 bg-accent text-accent-foreground rounded">Portföyün</div>
              <div className="p-4 bg-muted text-muted-foreground rounded">Analizlerin</div>
            </div>
          </div>
          {/* Add more profile options here */}
        </CardContent>
      </Card>
    </div>
  )
}
