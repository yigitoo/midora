"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../services/AuthProvider"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "../components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Save, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const { isLoggedIn, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    joinDate: ''
  })

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    } else if (user) {
      setUserData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        joinDate: new Date(user.createdAt).toLocaleDateString() || ''
      })
    }
  }, [isLoggedIn, user, router])

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch('/api/auth/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: userData.name,
          bio: userData.bio,
          location: userData.location
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update profile')
      }

      const updatedUser = await response.json()
      setUserData(prev => ({
        ...prev,
        ...updatedUser
      }))

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      setIsEditing(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isLoggedIn) {
    return <div>Lütfen profilinizi görüntülemek için giriş yapın</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Profilin</CardTitle>
              <CardDescription style={{paddingTop: '10px', fontSize: '15px'}}>
                Kendi profilini, portföy ve bilgilerini yönetebilmen için hazırladık.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={isEditing ? handleSave : handleEdit}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEditing ? (
                <Save className="h-4 w-4" />
              ) : (
                <Edit2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle">Renk Teması</Label>
            <ThemeToggle />
          </div>

          {/* User Information */}
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>İsim</Label>
                <Input
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={userData.email}
                  disabled
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label>Biyografi</Label>
                <Input
                  value={userData.bio}
                  onChange={(e) => setUserData({...userData, bio: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label>Konum</Label>
                <Input
                  value={userData.location}
                  onChange={(e) => setUserData({...userData, location: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label>Katılım Tarihi</Label>
                <Input
                  value={userData.joinDate}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Settings and Features */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Ayarlar ve Özellikler</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-primary text-primary-foreground rounded">
                Kişisel Bilgiler
              </div>
              <div className="p-4 bg-secondary text-secondary-foreground rounded">
                Öz geçmiş
              </div>
              {/* Add more feature cards as needed */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
