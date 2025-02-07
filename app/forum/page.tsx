"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/app/services/AuthProvider"
import { Search, Loader2, MessageCircle, Heart } from "lucide-react"
import debounce from "lodash/debounce"
import type { ForumEntry, ForumResponse } from "@/types/forum"
import { URL_MAP } from "@/lib/urls"

const ENTRIES_PER_PAGE = 20

export default function ForumPage() {
  const [entries, setEntries] = useState<ForumEntry[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  const fetchEntries = async (page: number, search: string = "") => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/forum?page=${page}&limit=${ENTRIES_PER_PAGE}&search=${encodeURIComponent(search)}`
      )
      if (!response.ok) throw new Error()
      const data: ForumResponse = await response.json()
      setEntries(data.posts)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Failed to fetch entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = debounce((value: string) => {
    setCurrentPage(1)
    fetchEntries(1, value)
  }, 300)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    debouncedSearch(e.target.value)
  }

  const handleLike = async (entryId: string) => {
    if (!isLoggedIn) {
      router.push(URL_MAP.loginPage)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/forum/entry/${entryId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error()

      setEntries(prev =>
        prev.map(entry =>
          entry._id === entryId
            ? { ...entry, likes: entry.likes + 1 }
            : entry
        )
      )
    } catch (error) {
      console.error("Failed to like entry:", error)
    }
  }

  useEffect(() => {
    fetchEntries(currentPage, searchTerm)
  }, [currentPage])

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Forum</h1>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Ara..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => (
            <Card key={entry._id} className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">{entry.title}</h2>
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {entry.content}
                </p>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      by {entry.author}
                    </span>
                    <button
                      onClick={() => handleLike(entry._id)}
                      className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                    >
                      <Heart className="h-4 w-4" />
                      {entry.likes}
                    </button>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      {entry.comments.length}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => router.push(`/forum/entry/${entry._id}`)}
                  >
                    Detaylar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Önceki
            </Button>
            <span className="py-2">
              Sayfa {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
