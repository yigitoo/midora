"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, ExternalLink, TrendingUp, Globe, DollarSign } from "lucide-react"

interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  source: {
    name: string
  }
  author?: string
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("general")

  useEffect(() => {
    fetchNews(selectedCategory)
  }, [selectedCategory])

  const fetchNews = async (category: string) => {
    setLoading(true)
    try {
      let query = ""
      switch (category) {
        case "stocks":
          query = "stocks OR stock market OR NYSE OR NASDAQ"
          break
        case "crypto":
          query = "cryptocurrency OR bitcoin OR ethereum"
          break
        case "economy":
          query = "economy OR economic OR GDP OR inflation"
          break
        case "turkey":
          query = "Turkey economy OR BIST OR Turkish lira"
          break
        default:
          query = "finance OR financial markets"
      }

      // Using News API - you'll need to add NEXT_PUBLIC_NEWS_API_KEY to your environment
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`,
      )

      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles || [])
      } else {
        // Fallback to mock data if API fails
        setArticles(getMockNews(category))
      }
    } catch (error) {
      console.error("Error fetching news:", error)
      setArticles(getMockNews(category))
    } finally {
      setLoading(false)
    }
  }

  const getMockNews = (category: string): NewsArticle[] => {
    const mockArticles = [
      {
        title: "Stock Market Reaches New Heights Amid Economic Recovery",
        description:
          "Major indices continue their upward trajectory as investors show confidence in the economic recovery. Technology stocks lead the gains.",
        url: "#",
        urlToImage: "/placeholder.svg?height=200&width=400",
        publishedAt: new Date().toISOString(),
        source: { name: "Financial Times" },
        author: "John Smith",
      },
      {
        title: "Federal Reserve Signals Potential Interest Rate Changes",
        description:
          "The Federal Reserve hints at possible adjustments to interest rates in response to inflation data and economic indicators.",
        url: "#",
        urlToImage: "/placeholder.svg?height=200&width=400",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: { name: "Reuters" },
        author: "Jane Doe",
      },
      {
        title: "Tech Giants Report Strong Quarterly Earnings",
        description:
          "Major technology companies exceed expectations in their latest quarterly reports, driving market optimism.",
        url: "#",
        urlToImage: "/placeholder.svg?height=200&width=400",
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: { name: "Bloomberg" },
        author: "Mike Johnson",
      },
      {
        title: "BIST 100 Index Shows Resilience Amid Global Uncertainty",
        description:
          "Turkish stock market demonstrates stability as investors focus on domestic economic policies and regional developments.",
        url: "#",
        urlToImage: "/placeholder.svg?height=200&width=400",
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        source: { name: "Anadolu Agency" },
        author: "Ahmet Yılmaz",
      },
    ]

    return mockArticles
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Financial News
            </h1>
            <p className="text-muted-foreground">Stay updated with the latest market news and analysis</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="stocks" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Stocks
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Crypto
            </TabsTrigger>
            <TabsTrigger value="economy" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Economy
            </TabsTrigger>
            <TabsTrigger value="turkey" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Turkey
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg" />
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded" />
                        <div className="h-3 bg-muted rounded w-5/6" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
                    {article.urlToImage && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={article.urlToImage || "/placeholder.svg"}
                          alt={article.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{article.source.name}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(article.publishedAt)}
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight hover:text-blue-600 cursor-pointer">
                        {article.title}
                      </CardTitle>
                      {article.author && <CardDescription className="text-sm">by {article.author}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{article.description}</p>
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          Read More
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && filteredArticles.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No articles found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or category selection</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
