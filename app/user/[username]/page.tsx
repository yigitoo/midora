"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Separator } from "@/app/components/ui/separator"
import { Badge } from "@/app/components/ui/badge"
import { Loader2, Calendar, MapPin, Mail, MessageSquare, FileText, BarChart3 } from "lucide-react"
import { API_URL, IMAGE_URL } from "@/lib/urls"
import { useAuth } from "@/services/AuthProvider"

interface UserProfile {
  user: {
    _id: string
    username: string
    name: string
    email: string
    bio?: string
    location?: string
    createdAt: string
    updatedAt?: string
    avatar?: string
  }
  recentPosts: any[]
  portfolio: any
}

export default function UserProfilePage() {
  const { username } = useParams()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user: currentUser } = useAuth()

  const isOwnProfile = currentUser?.username === username

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL.userProfileApiEndpoint}/${username}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("User not found")
          }
          throw new Error("Failed to fetch user profile")
        }

        const data = await response.json()
        setProfile(data)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchUserProfile()
    }
  }, [username])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-destructive text-xl">{error}</div>
        <Button className="mt-4" variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  if (!profile) return null

  const { user, recentPosts, portfolio } = profile

  const joinDate = new Date(user.createdAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="h-32 bg-gradient-vibrant" />
          <CardContent className="relative pt-0">
            <div className="flex flex-col md:flex-row gap-6 -mt-12">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                <AvatarImage
                  src={user.avatar || `${IMAGE_URL.randomAvatarGenerator}${user.username}`}
                  alt={user.name}
                />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 pt-12 md:pt-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="text-muted-foreground">@{user.username}</p>
                  </div>

                  <div className="mt-4 md:mt-0 flex gap-2">
                    {isOwnProfile ? (
                      <Button className="bg-primary hover:bg-primary/90">Edit Profile</Button>
                    ) : (
                      <Button className="bg-primary hover:bg-primary/90">Follow</Button>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  {user.bio && <p className="text-sm text-foreground/90 mb-4">{user.bio}</p>}

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {joinDate}</span>
                    </div>

                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}

                    {isOwnProfile && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="posts" className="mt-8">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
          <TabsTrigger value="posts" className="flex gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Portfolio</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="flex gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden md:inline">About</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-bold mb-4">Recent Posts</h2>

            {recentPosts.length > 0 ? (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <Card key={post._id} className="card-hover">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.content}</p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.uploadTime).toLocaleDateString("tr-TR")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {post.comments?.length || 0}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No posts yet</div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="portfolio">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-bold mb-4">Investment Portfolio</h2>

            {portfolio ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolio.stocks?.map((stock: any) => (
                  <Card key={stock.symbol} className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">{stock.symbol}</h3>
                          <p className="text-sm text-muted-foreground">{stock.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{stock.shares} shares</p>
                          <p className="text-sm text-muted-foreground">Avg. Price: ${stock.averagePrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No portfolio information available</div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="about">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>About {user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.bio ? (
                    <div>
                      <h3 className="font-semibold mb-2">Bio</h3>
                      <p>{user.bio}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No bio provided</p>
                  )}

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">Member Since</h3>
                    <p>{joinDate}</p>
                  </div>

                  {user.location && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-2">Location</h3>
                        <p>{user.location}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
