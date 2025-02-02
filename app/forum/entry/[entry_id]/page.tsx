"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/app/services/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, MessageCircle, ArrowLeft, Heart } from "lucide-react"

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
  onCommentUpdate,
  depth = 0
}: {
  comment: Comment
  entryId: string
  onCommentUpdate: () => Promise<void>
  depth: number
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isLoggedIn } = useAuth()
  const { toast } = useToast()

  const handleReply = async () => {
    if (!replyContent.trim() || depth >= 2) return

    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/forum/entry/${entryId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: replyContent,
          parentCommentId: comment._id,
          depth: depth + 1
        }),
      })

      if (!response.ok) throw new Error()

      setReplyContent("")
      setShowReplyInput(false)
      await onCommentUpdate()

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
        ${depth > 0 ? 'border-primary/20' : 'border-transparent'}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">{comment.author}</span>
          <span className="text-sm text-muted-foreground">
            {new Date(comment.uploadTime).toLocaleString("tr-TR")}
          </span>
        </div>
        <p className="mb-2">{comment.content}</p>
        {isLoggedIn && depth < 2 && (
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
              onCommentUpdate={onCommentUpdate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function EntryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const { toast } = useToast()
  const [entry, setEntry] = useState<ForumEntry | null>(null)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchEntry = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/forum/entry/${params.entry_id}`)
      if (!response.ok) throw new Error()
      const data = await response.json()
      setEntry(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Gönderi yüklenirken bir hata oluştu"
      })
      router.push('/forum')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntry()
  }, [params.entry_id])

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/forum/entry/${params.entry_id}/comment`, {
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
        className="mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Geri Dön
      </Button>

      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">{entry.title}</h1>
          <p className="text-gray-700 mb-6">{entry.content}</p>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Yorumlar</h2>

            {isLoggedIn && (
              <div className="space-y-2 mb-6">
                <Textarea
                  placeholder="Yorumunuzu yazın..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
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
                  onCommentUpdate={fetchEntry}
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
