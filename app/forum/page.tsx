"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, TrendingUp, Users, Plus, Search, Heart, Reply } from "lucide-react"

const forumPosts = [
  {
    id: 1,
    title: "AAPL Q4 Earnings Analysis - What to Expect",
    content:
      "Apple's upcoming earnings report could be a game changer. Looking at the technical indicators and market sentiment...",
    author: "TechAnalyst",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Earnings",
    replies: 23,
    likes: 45,
    time: "2 hours ago",
    tags: ["AAPL", "Earnings", "Tech"],
  },
  {
    id: 2,
    title: "BIST 100 Technical Breakout Pattern",
    content:
      "I'm seeing a potential ascending triangle formation on BIST 100. The resistance at 9,500 has been tested multiple times...",
    author: "IstanbulTrader",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Technical Analysis",
    replies: 18,
    likes: 32,
    time: "4 hours ago",
    tags: ["BIST", "Technical", "Breakout"],
  },
  {
    id: 3,
    title: "Fed Rate Decision Impact on NASDAQ",
    content:
      "With the upcoming Fed meeting, how do you think the rate decision will affect tech stocks? Historical data shows...",
    author: "MacroInvestor",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Market News",
    replies: 67,
    likes: 89,
    time: "6 hours ago",
    tags: ["Fed", "NASDAQ", "Rates"],
  },
]

const categories = [
  { name: "All", count: 234, icon: MessageSquare },
  { name: "Market News", count: 89, icon: TrendingUp },
  { name: "Technical Analysis", count: 67, icon: TrendingUp },
  { name: "Earnings", count: 45, icon: TrendingUp },
  { name: "General Discussion", count: 33, icon: Users },
]

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Midora Forum
            </h1>
            <p className="text-muted-foreground">Connect with fellow investors and share market insights</p>
          </div>
          <Button className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant={selectedCategory === category.name ? "default" : "ghost"}
                    className="w-full justify-between"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      {category.name}
                    </div>
                    <Badge variant="secondary">{category.count}</Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Forum Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Posts</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="font-semibold">567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Today's Posts</span>
                  <span className="font-semibold">23</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Tabs defaultValue="recent" className="mb-6">
              <TabsList>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-4">
                {forumPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={post.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg hover:text-blue-600 cursor-pointer">{post.title}</CardTitle>
                            <CardDescription>
                              by {post.author} • {post.time}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline">{post.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{post.content}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {post.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <Reply className="h-4 w-4" />
                            {post.replies}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="trending">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Trending discussions will appear here</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="unanswered">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Unanswered questions will appear here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
