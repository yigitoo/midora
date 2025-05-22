"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "@/app/components/ui/separator"
import { Loader2, ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart2, Calendar, Info } from "lucide-react"
import { API_URL } from "@/lib/urls"
import type { StockData } from "@/lib/stockService"

interface StockHistoricalData {
  date: string
  price: number
}

export default function StockDetailsPage() {
  const { symbol } = useParams()
  const searchParams = useSearchParams()
  const exchange = searchParams.get("exchange") || "NYSE"
  const router = useRouter()

  const [stock, setStock] = useState<StockData | null>(null)
  const [historicalData, setHistoricalData] = useState<StockHistoricalData[]>([])
  const [timeframe, setTimeframe] = useState<string>("1M")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true)

        // Fetch stock details
        const detailsResponse = await fetch(`${API_URL.stockDetailsApiEndpoint}/${symbol}?exchange=${exchange}`)
        if (!detailsResponse.ok) throw new Error("Failed to fetch stock details")
        const stockData = await detailsResponse.json()
        setStock(stockData)

        // Fetch historical data
        await fetchHistoricalData(timeframe)
      } catch (error: any) {
        console.error("Error fetching stock data:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (symbol) {
      fetchStockData()
    }
  }, [symbol, exchange])

  const fetchHistoricalData = async (period: string) => {
    try {
      // Calculate from date based on period
      const now = Math.floor(Date.now() / 1000)
      let from: number
      let resolution: string

      switch (period) {
        case "1D":
          from = now - 24 * 60 * 60
          resolution = "5"
          break
        case "1W":
          from = now - 7 * 24 * 60 * 60
          resolution = "60"
          break
        case "1M":
          from = now - 30 * 24 * 60 * 60
          resolution = "D"
          break
        case "3M":
          from = now - 90 * 24 * 60 * 60
          resolution = "D"
          break
        case "1Y":
          from = now - 365 * 24 * 60 * 60
          resolution = "W"
          break
        case "5Y":
          from = now - 5 * 365 * 24 * 60 * 60
          resolution = "M"
          break
        default:
          from = now - 30 * 24 * 60 * 60
          resolution = "D"
      }

      const response = await fetch(
        `${API_URL.stockHistoricalApiEndpoint}/${symbol}?resolution=${resolution}&from=${from}&to=${now}`,
      )

      if (!response.ok) throw new Error("Failed to fetch historical data")

      const data = await response.json()
      setHistoricalData(data)
      setTimeframe(period)
    } catch (error) {
      console.error("Error fetching historical data:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading stock data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-destructive text-xl">{error}</div>
        <Button className="mt-4" variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  if (!stock) return null

  const priceColor = stock.change >= 0 ? "text-green-500" : "text-red-500"
  const PriceIcon = stock.change >= 0 ? TrendingUp : TrendingDown

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-6 flex items-center gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back to Search
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-primary/10 to-accent/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{stock.symbol}</h1>
                  <Badge className="bg-primary/20 text-primary">{stock.exchange}</Badge>
                </div>
                <p className="text-xl text-muted-foreground">{stock.name}</p>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-3xl font-bold">${stock.price.toFixed(2)}</div>
                <div className={`flex items-center gap-1 ${priceColor}`}>
                  <PriceIcon className="h-4 w-4" />
                  <span className="font-medium">
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-card/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Market Cap</span>
                </div>
                <div className="text-lg font-semibold">${(stock.marketCap / 1e9).toFixed(2)}B</div>
              </div>

              <div className="bg-card/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <BarChart2 className="h-4 w-4" />
                  <span className="text-sm">Volume</span>
                </div>
                <div className="text-lg font-semibold">{(stock.volume / 1e6).toFixed(2)}M</div>
              </div>

              <div className="bg-card/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">P/E Ratio</span>
                </div>
                <div className="text-lg font-semibold">{stock.pe ? stock.pe.toFixed(2) : "N/A"}</div>
              </div>

              <div className="bg-card/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Dividend Yield</span>
                </div>
                <div className="text-lg font-semibold">
                  {stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : "N/A"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Price History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue={timeframe}
              value={timeframe}
              onValueChange={(value) => fetchHistoricalData(value)}
              className="mb-4"
            >
              <TabsList>
                <TabsTrigger value="1D">1D</TabsTrigger>
                <TabsTrigger value="1W">1W</TabsTrigger>
                <TabsTrigger value="1M">1M</TabsTrigger>
                <TabsTrigger value="3M">3M</TabsTrigger>
                <TabsTrigger value="1Y">1Y</TabsTrigger>
                <TabsTrigger value="5Y">5Y</TabsTrigger>
              </TabsList>

              <TabsContent value={timeframe} className="h-80 w-full">
                {historicalData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(var(--muted-foreground))"
                        tickFormatter={(date) => {
                          const d = new Date(date)
                          if (timeframe === "1D")
                            return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
                          if (timeframe === "1W") return d.toLocaleDateString("tr-TR", { weekday: "short" })
                          if (timeframe === "1M" || timeframe === "3M")
                            return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })
                          if (timeframe === "1Y") return d.toLocaleDateString("tr-TR", { month: "short" })
                          return d.toLocaleDateString("tr-TR", { month: "short", year: "numeric" })
                        }}
                      />
                      <YAxis domain={["auto", "auto"]} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                        labelFormatter={(date) =>
                          new Date(date).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No historical data available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Company Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                {stock.name} is a leading company in the {stock.industry.toLowerCase()} sector. With a market
                capitalization of ${(stock.marketCap / 1e9).toFixed(2)} billion, it is one of the{" "}
                {stock.marketCap > 100e9 ? "largest" : "significant"} players in its industry.
              </p>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Industry</h3>
                  <p>{stock.industry}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Exchange</h3>
                  <p>{stock.exchange}</p>
                </div>
              </div>

              <Button className="mt-6">View Full Profile</Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Key Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground">P/E Ratio</span>
                  <span className="font-semibold">{stock.pe ? stock.pe.toFixed(2) : "N/A"}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground">Dividend Yield</span>
                  <span className="font-semibold">
                    {stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground">Beta</span>
                  <span className="font-semibold">{stock.beta ? stock.beta.toFixed(2) : "N/A"}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground">EPS</span>
                  <span className="font-semibold">${stock.eps ? stock.eps.toFixed(2) : "N/A"}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground">52 Week High</span>
                  <span className="font-semibold">${(stock.price * 1.2).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground">52 Week Low</span>
                  <span className="font-semibold">${(stock.price * 0.8).toFixed(2)}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-6">
                Add to Watchlist
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
