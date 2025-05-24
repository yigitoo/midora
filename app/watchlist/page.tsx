"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Plus, Star, TrendingUp, Eye, Trash2, Search, Globe, Lock } from "lucide-react"
import Link from "next/link"
import type { WatchlistWithItems } from "@/lib/watchlist-service"

export default function WatchlistsPage() {
  const [watchlists, setWatchlists] = useState<WatchlistWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newWatchlist, setNewWatchlist] = useState({
    name: "",
    description: "",
    isPublic: false,
  })

  // Mock user ID - in production, get from auth context
  const userId = "mock-user-id"

  useEffect(() => {
    fetchWatchlists()
  }, [])

  const fetchWatchlists = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/watchlists?userId=${userId}`)
      const data = await response.json()
      setWatchlists(data.watchlists || [])
    } catch (error) {
      console.error("Error fetching watchlists:", error)
    } finally {
      setLoading(false)
    }
  }

  const createWatchlist = async () => {
    try {
      const response = await fetch("/api/watchlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...newWatchlist,
        }),
      })

      if (response.ok) {
        setCreateDialogOpen(false)
        setNewWatchlist({ name: "", description: "", isPublic: false })
        fetchWatchlists()
      }
    } catch (error) {
      console.error("Error creating watchlist:", error)
    }
  }

  const deleteWatchlist = async (watchlistId: string) => {
    try {
      const response = await fetch(`/api/watchlists/${watchlistId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchWatchlists()
      }
    } catch (error) {
      console.error("Error deleting watchlist:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Watchlists</h1>
          <p className="text-muted-foreground">Track your favorite stocks and monitor market movements</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Watchlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Watchlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newWatchlist.name}
                  onChange={(e) => setNewWatchlist({ ...newWatchlist, name: e.target.value })}
                  placeholder="My Tech Stocks"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newWatchlist.description}
                  onChange={(e) => setNewWatchlist({ ...newWatchlist, description: e.target.value })}
                  placeholder="Technology companies I'm tracking..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={newWatchlist.isPublic}
                  onCheckedChange={(checked) => setNewWatchlist({ ...newWatchlist, isPublic: checked })}
                />
                <Label htmlFor="public">Make this watchlist public</Label>
              </div>
              <Button onClick={createWatchlist} className="w-full">
                Create Watchlist
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {watchlists.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No watchlists yet</h3>
            <p className="text-muted-foreground mb-4">Create your first watchlist to start tracking stocks</p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Watchlist
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlists.map((watchlist) => (
            <motion.div
              key={watchlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{watchlist.name}</CardTitle>
                        {watchlist.is_public ? (
                          <Globe className="h-4 w-4 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      {watchlist.description && (
                        <p className="text-sm text-muted-foreground mt-1">{watchlist.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteWatchlist(watchlist.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stocks</span>
                      <Badge variant="secondary">{watchlist.itemCount}</Badge>
                    </div>

                    {watchlist.items.length > 0 && (
                      <div className="space-y-2">
                        {watchlist.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.symbol}</span>
                              <Badge variant="outline" className="text-xs">
                                {item.exchange}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-green-500">
                              <TrendingUp className="h-3 w-3" />
                              <span>+2.4%</span>
                            </div>
                          </div>
                        ))}
                        {watchlist.items.length > 3 && (
                          <p className="text-xs text-muted-foreground">+{watchlist.items.length - 3} more stocks</p>
                        )}
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Created {new Date(watchlist.created_at).toLocaleDateString()}
                      </span>
                      <Link href={`/watchlists/${watchlist.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/screener">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Search className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Market Screener</h3>
                <p className="text-sm text-muted-foreground">Find stocks that match your criteria</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/stocks/search">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Add Stocks</h3>
                <p className="text-sm text-muted-foreground">Search and add stocks to watchlists</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/stocks">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Top Movers</h3>
                <p className="text-sm text-muted-foreground">See today's biggest gainers and losers</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
