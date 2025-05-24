"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, TrendingDown, Loader2, BarChart3 } from "lucide-react"
import Link from "next/link"
import { formatPrice, formatNumber } from "@/lib/utils"
import type { StockData } from "@/lib/stock-service"

export default function StocksPage() {
  const [topStocks, setTopStocks] = useState<Record<string, StockData[]>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [activeExchange, setActiveExchange] = useState<string>("NYSE")

  useEffect(() => {
    fetchTopStocks()
  }, [])

  const fetchTopStocks = async () => {
    try {
      setLoading(true)
      const exchanges = ["NYSE", "NASDAQ", "BIST"]
      const stockPromises = exchanges.map(async (exchange) => {
        const response = await fetch(`/api/stocks/top?exchange=${exchange}&limit=20`)
        const data = await response.json()
        return { exchange, stocks: data.stocks || [] }
      })

      const stockResults = await Promise.all(stockPromises)
      const stocksData: Record<string, StockData[]> = {}
      stockResults.forEach(({ exchange, stocks }) => {
        stocksData[exchange] = stocks
      })

      setTopStocks(stocksData)
    } catch (error) {
      console.error("Error fetching top stocks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      setSearching(true)
      const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setSearchResults(data.stocks || [])
    } catch (error) {
      console.error("Error searching stocks:", error)
      setSearchResults([])
    } finally {
      setSearching(false)
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
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Stock Market</h1>
        </div>
        <p className="text-xl text-muted-foreground mb-6">Explore stocks from NYSE, NASDAQ, and BIST exchanges</p>

        {/* Search Bar */}
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Search stocks (e.g., AAPL, THYAO, MSFT)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={searching}>
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((stock) => (
                  <Link
                    key={`${stock.symbol}-${stock.exchange}`}
                    href={`/stocks/${stock.symbol}?exchange=${stock.exchange}`}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{stock.symbol}</h3>
                            <Badge variant="outline">{stock.exchange}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{stock.name}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold">
                            {formatPrice(stock.price, stock.exchange === "BIST" ? "TRY" : "USD")}
                          </div>
                          {formatChange(stock.change, stock.changePercent)}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Top Stocks by Exchange */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Stocks by Exchange
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeExchange} onValueChange={setActiveExchange} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="NYSE">NYSE</TabsTrigger>
                <TabsTrigger value="NASDAQ">NASDAQ</TabsTrigger>
                <TabsTrigger value="BIST">BIST</TabsTrigger>
              </TabsList>

              {Object.entries(topStocks).map(([exchange, stocks]) => (
                <TabsContent key={exchange} value={exchange} className="mt-6">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-32 bg-muted rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {stocks.map((stock) => (
                        <Link key={stock.symbol} href={`/stocks/${stock.symbol}?exchange=${stock.exchange}`}>
                          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">{stock.symbol}</h3>
                                  <Badge variant="outline">{stock.exchange}</Badge>
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{stock.name}</p>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Price</span>
                                  <span className="text-lg font-bold">
                                    {formatPrice(stock.price, stock.exchange === "BIST" ? "TRY" : "USD")}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Change</span>
                                  {formatChange(stock.change, stock.changePercent)}
                                </div>

                                {stock.volume && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Volume</span>
                                    <span className="text-sm font-medium">{formatNumber(stock.volume)}</span>
                                  </div>
                                )}

                                {stock.marketCap && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Market Cap</span>
                                    <span className="text-sm font-medium">{formatNumber(stock.marketCap)}</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
