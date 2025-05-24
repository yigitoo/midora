"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Loader2,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart2,
  Calendar,
  Info,
  Newspaper,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatPrice, formatNumber, formatPercent } from "@/lib/utils"
import type { StockData, HistoricalData, NewsArticle } from "@/lib/stock-service"
import type { TechnicalIndicators } from "@/lib/technical-indicators"

export default function StockDetailsPage() {
  const { symbol } = useParams()
  const searchParams = useSearchParams()
  const exchange = searchParams.get("exchange") || "NYSE"
  const router = useRouter()

  const [stock, setStock] = useState<StockData | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [news, setNews] = useState<NewsArticle[]>([])
  const [timeframe, setTimeframe] = useState<string>("daily")
  const [loading, setLoading] = useState(true)
  const [newsLoading, setNewsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicators | null>(null)
  const [technicalLoading, setTechnicalLoading] = useState(true)

  useEffect(() => {
    if (symbol) {
      fetchStockData()
      fetchStockNews()
      fetchTechnicalIndicators()
    }
  }, [symbol, exchange])

  useEffect(() => {
    if (symbol) {
      fetchHistoricalData()
    }
  }, [symbol, timeframe])

  const fetchStockData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/stocks/details/${symbol}?exchange=${exchange}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch stock data")
      }

      setStock(data.stock)
    } catch (error: any) {
      console.error("Error fetching stock data:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(`/api/stocks/historical/${symbol}?interval=${timeframe}`)
      const data = await response.json()
      setHistoricalData(data.data || [])
    } catch (error) {
      console.error("Error fetching historical data:", error)
    }
  }

  const fetchStockNews = async () => {
    try {
      setNewsLoading(true)
      const response = await fetch(`/api/stocks/news/${symbol}?limit=10`)
      const data = await response.json()
      setNews(data.news || [])
    } catch (error) {
      console.error("Error fetching stock news:", error)
    } finally {
      setNewsLoading(false)
    }
  }

  const fetchTechnicalIndicators = async () => {
    try {
      setTechnicalLoading(true)
      const response = await fetch(`/api/stocks/technical/${symbol}?exchange=${exchange}`)
      const data = await response.json()
      setTechnicalIndicators(data.indicators || null)
    } catch (error) {
      console.error("Error fetching technical indicators:", error)
    } finally {
      setTechnicalLoading(false)
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
    <div>
      <Button variant="ghost" className="mb-6 flex items-center gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back to Search
      </Button>

      {/* Stock Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-primary/10 to-blue-600/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{stock.symbol}</h1>
                  <Badge className="bg-primary/20 text-primary">{stock.exchange}</Badge>
                </div>
                <p className="text-xl text-muted-foreground">{stock.name}</p>
                {stock.industry && <p className="text-sm text-muted-foreground">{stock.industry}</p>}
              </div>

              <div className="flex flex-col items-end">
                <div className="text-3xl font-bold">{formatPrice(stock.price, stock.currency)}</div>
                <div className={`flex items-center gap-1 ${priceColor}`}>
                  <PriceIcon className="h-4 w-4" />
                  <span className="font-medium">
                    {stock.change >= 0 ? "+" : ""}
                    {formatPrice(stock.change, stock.currency)} ({stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-card/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Market Cap</span>
                </div>
                <div className="text-lg font-semibold">{formatNumber(stock.marketCap)}</div>
              </div>

              <div className="bg-card/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <BarChart2 className="h-4 w-4" />
                  <span className="text-sm">Volume</span>
                </div>
                <div className="text-lg font-semibold">{formatNumber(stock.volume)}</div>
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

      {/* Price Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Price History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue={timeframe}
              value={timeframe}
              onValueChange={(value) => setTimeframe(value)}
              className="mb-4"
            >
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
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
                          return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
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
                          new Date(date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        }
                        formatter={(value: number) => [formatPrice(value, stock.currency), "Price"]}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Technical Analysis */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Technical Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Price Range</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Open</span>
                        <span className="font-medium">
                          {stock.open ? formatPrice(stock.open, stock.currency) : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">High</span>
                        <span className="font-medium">
                          {stock.high ? formatPrice(stock.high, stock.currency) : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Low</span>
                        <span className="font-medium">
                          {stock.low ? formatPrice(stock.low, stock.currency) : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Previous Close</span>
                        <span className="font-medium">
                          {stock.previousClose ? formatPrice(stock.previousClose, stock.currency) : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">52 Week Range</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">52W High</span>
                        <span className="font-medium">
                          {stock.fiftyTwoWeekHigh ? formatPrice(stock.fiftyTwoWeekHigh, stock.currency) : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">52W Low</span>
                        <span className="font-medium">
                          {stock.fiftyTwoWeekLow ? formatPrice(stock.fiftyTwoWeekLow, stock.currency) : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Beta</span>
                        <span className="font-medium">{stock.beta ? stock.beta.toFixed(2) : "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">EPS</span>
                        <span className="font-medium">
                          {stock.eps ? formatPrice(stock.eps, stock.currency) : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Financial Ratios</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">P/E Ratio</span>
                        <span className="font-medium">{stock.pe ? stock.pe.toFixed(2) : "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Forward P/E</span>
                        <span className="font-medium">{stock.forwardPE ? stock.forwardPE.toFixed(2) : "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">PEG Ratio</span>
                        <span className="font-medium">{stock.pegRatio ? stock.pegRatio.toFixed(2) : "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price/Book</span>
                        <span className="font-medium">{stock.priceToBook ? stock.priceToBook.toFixed(2) : "N/A"}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price/Sales</span>
                        <span className="font-medium">
                          {stock.priceToSales ? stock.priceToSales.toFixed(2) : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ROE</span>
                        <span className="font-medium">{formatPercent(stock.returnOnEquity)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ROA</span>
                        <span className="font-medium">{formatPercent(stock.returnOnAssets)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Profit Margin</span>
                        <span className="font-medium">{formatPercent(stock.profitMargin)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {stock.analystTargetPrice && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Analyst Target</h4>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Target Price</span>
                        <span className="font-medium text-primary">
                          {formatPrice(stock.analystTargetPrice, stock.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Upside/Downside</span>
                        <span
                          className={`font-medium ${((stock.analystTargetPrice - stock.price) / stock.price) >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {(((stock.analystTargetPrice - stock.price) / stock.price) * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Company Overview */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Company Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Market Cap</span>
                      <span className="font-medium">{formatNumber(stock.marketCap)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Enterprise Value</span>
                      <span className="font-medium">{formatNumber(stock.enterpriseValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">EBITDA</span>
                      <span className="font-medium">{formatNumber(stock.ebitda)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Book Value</span>
                      <span className="font-medium">
                        {stock.bookValue ? formatPrice(stock.bookValue, stock.currency) : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Growth Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quarterly Earnings Growth</span>
                      <span className="font-medium">{formatPercent(stock.quarterlyEarningsGrowth)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quarterly Revenue Growth</span>
                      <span className="font-medium">{formatPercent(stock.quarterlyRevenueGrowth)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Operating Margin</span>
                      <span className="font-medium">{formatPercent(stock.operatingMargin)}</span>
                    </div>
                  </div>
                </div>

                {(stock.forwardAnnualDividendRate || stock.dividendYield) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Dividend Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Annual Dividend Rate</span>
                          <span className="font-medium">
                            {stock.forwardAnnualDividendRate
                              ? formatPrice(stock.forwardAnnualDividendRate, stock.currency)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dividend Yield</span>
                          <span className="font-medium">
                            {stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payout Ratio</span>
                          <span className="font-medium">{formatPercent(stock.payoutRatio)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Technical Indicators Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Technical Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            {technicalLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : technicalIndicators ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* RSI */}
                <div className="space-y-2">
                  <h4 className="font-semibold">RSI (14)</h4>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">{technicalIndicators.rsi.toFixed(1)}</div>
                    <Badge
                      variant={
                        technicalIndicators.rsi < 30
                          ? "destructive"
                          : technicalIndicators.rsi > 70
                            ? "default"
                            : "secondary"
                      }
                    >
                      {technicalIndicators.rsi < 30
                        ? "Oversold"
                        : technicalIndicators.rsi > 70
                          ? "Overbought"
                          : "Neutral"}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${technicalIndicators.rsi}%` }} />
                  </div>
                </div>

                {/* MACD */}
                <div className="space-y-2">
                  <h4 className="font-semibold">MACD</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">MACD</span>
                      <span className="font-medium">{technicalIndicators.macd.macd.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Signal</span>
                      <span className="font-medium">{technicalIndicators.macd.signal.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Histogram</span>
                      <span
                        className={`font-medium ${
                          technicalIndicators.macd.histogram > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {technicalIndicators.macd.histogram.toFixed(3)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bollinger Bands */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Bollinger Bands</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Upper</span>
                      <span className="font-medium">
                        {formatPrice(technicalIndicators.bollingerBands.upper, stock.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Middle</span>
                      <span className="font-medium">
                        {formatPrice(technicalIndicators.bollingerBands.middle, stock.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Lower</span>
                      <span className="font-medium">
                        {formatPrice(technicalIndicators.bollingerBands.lower, stock.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Moving Averages */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Moving Averages</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">SMA 20</span>
                      <span className="font-medium">{formatPrice(technicalIndicators.sma20, stock.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">SMA 50</span>
                      <span className="font-medium">{formatPrice(technicalIndicators.sma50, stock.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">EMA 12</span>
                      <span className="font-medium">{formatPrice(technicalIndicators.ema12, stock.currency)}</span>
                    </div>
                  </div>
                </div>

                {/* Stochastic */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Stochastic</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">%K</span>
                      <span className="font-medium">{technicalIndicators.stochastic.k.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">%D</span>
                      <span className="font-medium">{technicalIndicators.stochastic.d.toFixed(1)}</span>
                    </div>
                    <Badge
                      variant={
                        technicalIndicators.stochastic.k < 20
                          ? "destructive"
                          : technicalIndicators.stochastic.k > 80
                            ? "default"
                            : "secondary"
                      }
                    >
                      {technicalIndicators.stochastic.k < 20
                        ? "Oversold"
                        : technicalIndicators.stochastic.k > 80
                          ? "Overbought"
                          : "Neutral"}
                    </Badge>
                  </div>
                </div>

                {/* Additional Indicators */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Other Indicators</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Williams %R</span>
                      <span className="font-medium">{technicalIndicators.williamsR.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Momentum</span>
                      <span className="font-medium">{technicalIndicators.momentum.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">ROC</span>
                      <span className="font-medium">{technicalIndicators.roc.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Technical indicators not available for this stock</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stock News Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              Latest News for {stock.symbol}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {newsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : news.length > 0 ? (
              <div className="space-y-6">
                {news.map((article, index) => (
                  <div key={index} className="border-b border-border pb-6 last:border-b-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              article.sentiment === "positive"
                                ? "default"
                                : article.sentiment === "negative"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {article.sentiment}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{article.source}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>

                        {article.summary && (
                          <p className="text-muted-foreground mb-3 line-clamp-3">{article.summary}</p>
                        )}

                        <Link
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                        >
                          Read full article
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>

                      {article.imageUrl && (
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={article.imageUrl || "/placeholder.svg"}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent news available for {stock.symbol}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
