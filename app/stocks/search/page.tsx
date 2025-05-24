"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import type { StockData } from "@/lib/stock-service"

export default function StockSearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [searchResults, setSearchResults] = useState<StockData[]>([])
  const [loading, setLoading] = useState(false)
  const [activeExchange, setActiveExchange] = useState<string>("all")

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery)
    }
  }, [initialQuery])

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      setLoading(true)
      const exchangeParam = activeExchange !== "all" ? `&exchange=${activeExchange}` : ""
      const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}${exchangeParam}`)
      const data = await response.json()
      setSearchResults(data.stocks || [])
    } catch (error) {
      console.error("Error searching stocks:", error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0
    const color = isPositive ? "text-green-500" : "text-red-500"
    const icon = isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />

    return (
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span>
          {isPositive ? "+" : ""}
          {change.toFixed(2)} ({changePercent.toFixed(2)}%)
        </span>
      </div>
    )
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-6">Stock Search</h1>

        {/* Search Bar */}
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Search stocks (e.g., AAPL, THYAO, MSFT)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button onClick={() => handleSearch()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {/* Exchange Filter */}
        <Tabs value={activeExchange} onValueChange={setActiveExchange} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Exchanges</TabsTrigger>
            <TabsTrigger value="NYSE">NYSE</TabsTrigger>
            <TabsTrigger value="NASDAQ">NASDAQ</TabsTrigger>
            <TabsTrigger value="BIST">BIST</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Search Results */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((stock) => (
              <Link
                key={`${stock.symbol}-${stock.exchange}`}
                href={`/stocks/${stock.symbol}?exchange=${stock.exchange}`}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-semibold">{stock.symbol}</h3>
                            <Badge variant="outline">{stock.exchange}</Badge>
                          </div>
                          <p className="text-muted-foreground">{stock.name}</p>
                          {stock.volume && (
                            <p className="text-sm text-muted-foreground">Volume: {stock.volume.toLocaleString()}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold mb-1">
                          {formatPrice(stock.price, stock.exchange === "BIST" ? "TRY" : "USD")}
                        </div>
                        {formatChange(stock.change, stock.changePercent)}
                        {stock.marketCap && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Market Cap: ${(stock.marketCap / 1e9).toFixed(2)}B
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : searchQuery && !loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No stocks found for "{searchQuery}"</p>
              <p className="text-sm text-muted-foreground mt-2">Try searching with a different term or stock symbol</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Enter a stock symbol or company name to search</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
