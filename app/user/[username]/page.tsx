"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Mail, Calendar, MapPin,
  Heart, MessageCircle, Send,
  Loader2, Github, Twitter, Linkedin
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { API_URL, URL_MAP } from "@/lib/urls"

interface UserProfile {
  name: string
  username: string
  joinDate: string
  bio?: string
  postCount: number
  avatar: string
  posts: Array<{
    _id: string
    title: string
    content: string
    uploadTime: string
    likes: number
    comments: Array<{
      _id: string
      content: string
      author: string
      uploadTime: string
      likes: number
    }>
  }>
  email?: string
  location?: string
  totalLikes?: number
  totalComments?: number
}

interface UserComment {
  _id: string
  content: string
  entryId: string
  entryTitle: string
  uploadTime: string
}

interface UserLike {
  _id: string
  entryId: string
  entryTitle: string
  likeTime: string
}

const DEFAULT_AVATAR = "/images/default-avatar.png"

const GRADIENT_COLORS = [
  'from-blue-500 to-blue-300',
  'from-purple-500 to-purple-300',
  'from-green-500 to-green-300',
  'from-indigo-500 to-indigo-300',
  'from-cyan-500 to-cyan-300',
  'from-teal-500 to-teal-300',
  'from-violet-500 to-violet-300',
  'from-sky-500 to-sky-300'
]

export default function UserProfilePage() {
  const router = useRouter()
  const params = useParams()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("posts")
  const [activePost, setActivePost] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [comments, setComments] = useState<UserComment[]>([])
  const [likes, setLikes] = useState<UserLike[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [loadingLikes, setLoadingLikes] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!params.username) {
          throw new Error("Kullanıcı adı bulunamadı")
        }

        setLoading(true)
        const response = await fetch(`${API_URL.userAuthApiEndpoint}/${params.username}`)

        if (!response.ok) {
          throw new Error("Kullanıcı bulunamadı")
        }

        const data = await response.json()
        setProfile(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Bir hata oluştu")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [params.username])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const randomGradient = GRADIENT_COLORS[Math.floor(Math.random() * GRADIENT_COLORS.length)]

  const handleLike = async (postId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL.forumEntryApiEndpoint}/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "like" }),
      })

      if (!response.ok) throw new Error("İşlem başarısız")

      setProfile(prev => ({
        ...prev!,
        posts: prev!.posts.map(post =>
          post._id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      }))

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Beğeni eklenemedi"
      })
    }
  }

  const handleComment = async (postId: string) => {
    if (!newComment.trim()) return

    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL.forumEntryApiEndpoint}/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) throw new Error("Yorum gönderilemedi")

      const comment = await response.json()
      setProfile(prev => ({
        ...prev!,
        posts: prev!.posts.map(post =>
          post._id === postId
            ? { ...post, comments: [...post.comments, comment] }
            : post
        )
      }))

      setNewComment("")
      setActivePost(null)
      toast({
        title: "Başarılı",
        description: "Yorumunuz eklendi"
      })

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Yorum gönderilemedi"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchUserComments = async () => {
    try {
      setLoadingComments(true)
      const response = await fetch(`${API_URL.userAuthApiEndpoint}/${params.username}/comments`)
      if (!response.ok) throw new Error()
      const data = await response.json()
      setComments(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Yorumlar yüklenirken bir hata oluştu"
      })
    } finally {
      setLoadingComments(false)
    }
  }

  const fetchUserLikes = async () => {
    try {
      setLoadingLikes(true)
      const response = await fetch(`${API_URL.userAuthApiEndpoint}/${params.username}/likes`)
      if (!response.ok) throw new Error()
      const data = await response.json()
      setLikes(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Beğeniler yüklenirken bir hata oluştu"
      })
    } finally {
      setLoadingLikes(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'comments') {
      fetchUserComments()
    } else if (activeTab === 'likes') {
      fetchUserLikes()
    }
  }, [activeTab])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !profile) {
    setTimeout(() => {
      router.push(URL_MAP.homePage)
    }, 1500)
    return <div className="text-center text-red-500 py-8">{error}</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="relative mb-8">
        <div className={`h-48 bg-gradient-to-r ${randomGradient} rounded-lg`} />
        <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
          <div className="relative">
            <Image
              style={{ zIndex: 1, background: "white" }}
              src={profile.avatar || DEFAULT_AVATAR}
              alt={profile.name}
              width={128}
              height={128}
              className="rounded-full border-4 border-primary"
              priority
            />
          </div>
          <div className="p-4 bg-card rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground">@{profile.username}</p>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{profile?.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  Katıldı {new Date(profile?.joinDate || "").toLocaleDateString("tr-TR")}
                </span>
              </div>
              {profile?.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{profile?.postCount}</div>
                  <div className="text-xs text-muted-foreground">Gönderiler</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{profile?.totalLikes || 0}</div>
                  <div className="text-xs text-muted-foreground">Beğeniler</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{profile?.totalComments || 0}</div>
                  <div className="text-xs text-muted-foreground">Yorumlar</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center space-x-4">
                <Button variant="ghost" size="icon">
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="posts">Gönderiler</TabsTrigger>
            <TabsTrigger value="comments">Yorumlar</TabsTrigger>
            <TabsTrigger value="likes">Beğeniler</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="space-y-4">
            {profile?.posts.map(post => (
              <Card key={post._id} className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post._id)}
                        className="flex items-center space-x-1"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActivePost(activePost === post._id ? null : post._id)}
                        className="flex items-center space-x-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments.length}</span>
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.uploadTime).toLocaleDateString("tr-TR")}
                    </span>
                  </div>

                  {activePost === post._id && (
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Yorumunuzu yazın..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <Button
                          onClick={() => handleComment(post._id)}
                          disabled={isSubmitting}
                          className="w-full"
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Yorum Yap"
                          )}
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {post.comments.map(comment => (
                          <div key={comment._id} className="bg-muted/50 p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.uploadTime).toLocaleDateString("tr-TR")}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="comments" className="space-y-4">
            {loadingComments ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <Card key={comment._id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium hover:text-primary cursor-pointer"
                        onClick={() => router.push(`${URL_MAP.forumEntryPage}/${comment.entryId}`)}
                      >
                        {comment.entryTitle}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.uploadTime).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{comment.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground p-4">
                Henüz yorum yapılmamış
              </div>
            )}
          </TabsContent>

          <TabsContent value="likes" className="space-y-4">
            {loadingLikes ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : likes.length > 0 ? (
              likes.map((like) => (
                <Card key={like._id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium hover:text-primary cursor-pointer"
                        onClick={() => router.push(`${URL_MAP.forumEntryPage}/${like.entryId}`)}
                      >
                        {like.entryTitle}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {new Date(like.likeTime).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground p-4">
                Henüz beğeni yapılmamış
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
