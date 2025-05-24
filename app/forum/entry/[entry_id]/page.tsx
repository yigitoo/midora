"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/services/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Heart, MessageCircle, Loader2 } from "lucide-react"
import { API_URL, URL_MAP } from "@/lib/urls"

import { DEPTH_LIMIT } from '@/types/forum'

interface Comment {
  _id: string
  content: string
  author: string
  uploadTime: string
  likes: number
  replies: Comment[]
  parentId?: string
  depth: number
}

interface ForumEntry {
  _id: string
  title: string
  content: string
  author: string
  uploadTime: string
  likes: number
  comments: Comment[]
}

const CommentComponent = ({
  comment,
  entryId,
  onReply,
  depth = 0
}: {
  comment: Comment
  entryId: string
  onReply: () => Promise<void>
  depth: number
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isLoggedIn } = useAuth()
  const { toast } = useToast()

  const handleReply = async () => {
    if (!replyContent.trim() || depth >= DEPTH_LIMIT) return

    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL.forumEntryApiEndpoint}/${entryId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: replyContent,
          parentId: comment._id,
          depth: depth + 1
        }),
      })

      if (!response.ok) throw new Error()

      setReplyContent("")
      setShowReplyInput(false)
      await onReply()

      toast({
        title: "Başarılı",
        description: "Yanıtınız eklendi"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Yanıt gönderilemedi"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className={`bg-muted/50 p-4 rounded-lg border-l-2
        ${depth > 0 ? `border-primary/${20 + depth * 20}` : 'border-transparent'}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">{comment.author}</span>
          <span className="text-sm text-muted-foreground">
            {new Date(comment.uploadTime).toLocaleString("tr-TR")}
          </span>
        </div>
        <p className="mb-2">{comment.content}</p>
        {isLoggedIn && depth < 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyInput(!showReplyInput)}
          >
            Yanıtla
          </Button>
        )}
      </div>

      {showReplyInput && (
        <div className="ml-8 space-y-2">
          <Textarea
            placeholder="Yanıtınızı yazın..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <Button
            onClick={handleReply}
            disabled={isSubmitting}
            size="sm"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Yanıtla"
            )}
          </Button>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 space-y-2">
          {comment.replies.map(reply => (
            <CommentComponent
              key={reply._id}
              comment={reply}
              entryId={entryId}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function EntryPage() {
  const params = useParams()
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const { toast } = useToast()
  const [entry, setEntry] = useState<ForumEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLiked, setIsLiked] = useState(false);

  const fetchEntry = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL.forumEntryApiEndpoint}/${params.entry_id}`)
      if (!response.ok) throw new Error()
      const data = await response.json()
      setEntry(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Gönderi yüklenemedi"
      })
      router.push(URL_MAP.forumPage)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!isLoggedIn || !entry) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL.forumEntryApiEndpoint}/${entry._id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 400) {
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Gönderi yok veya zaten beğenildi."
        })
        setIsLiked(true);
      }
      if (!response.ok) throw new Error()

      setEntry(prev => prev ? { ...prev, likes: prev.likes + 1 } : null)

      toast({
        title: "Başarılı",
        description: "Gönderi beğenildi"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Beğeni eklenemedi"
      })
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL.forumEntryApiEndpoint}/${params.entry_id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newComment,
          depth: 0
        }),
      })

      if (!response.ok) throw new Error()

      setNewComment("")
      await fetchEntry()

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

  useEffect(() => {
    fetchEntry()
  }, [params.entry_id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!entry) return null

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Geri
      </Button>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">{entry.title}</h1>
            <p className="text-muted-foreground mb-4">{entry.content}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Yazar: {entry.author}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={!isLoggedIn}
                className="flex items-center gap-1"
              >
                <Heart className="h-4 w-4" />
                {entry.likes}
              </Button>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {entry.comments.length}
              </span>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Yorumlar</h2>

            {isLoggedIn && (
              <div className="mb-6">
                <Textarea
                  placeholder="Yorumunuzu yazın..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-2"
                />
                <Button
                  onClick={handleAddComment}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Yorum Yap"
                  )}
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {entry.comments.map((comment) => (
                <CommentComponent
                  key={comment._id}
                  comment={comment}
                  entryId={entry._id}
                  onReply={fetchEntry}
                  depth={0}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
