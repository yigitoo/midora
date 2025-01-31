"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "../components/ThemeToggle"

export default function SettingsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Mock logged in state

  if (!isLoggedIn) {
    // Redirect to login page or show a message
    return <div>Please log in to view settings</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle">Theme</Label>
            <ThemeToggle />
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Color Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-primary text-primary-foreground rounded">Primary</div>
              <div className="p-4 bg-secondary text-secondary-foreground rounded">Secondary</div>
              <div className="p-4 bg-accent text-accent-foreground rounded">Accent</div>
              <div className="p-4 bg-muted text-muted-foreground rounded">Muted</div>
            </div>
          </div>
          {/* Add more settings options here */}
        </CardContent>
      </Card>
    </div>
  )
}

