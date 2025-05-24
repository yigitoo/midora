"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, TrendingUp, TrendingDown, DollarSign, BarChart3, Globe, Star, RefreshCw } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"

interface Stock {
  id: number
  symbol: string
  company_name: string
  sector: string
  industry: string
  market_cap: number
  price: number
  change_percent: number
  volume: number
  pe_ratio: number
  dividend_yield: number
}

export default function MarketsPage() {
  const [nyseStocks, setNyseStocks] = useState<Stock[]>([])
  const [nasdaqStocks, setNasdaqStocks] = useState<Stock[]>([])
  const [bistStocks, setBistStocks] = useState<Stock[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    fetchStockData()
  }, [])

  const fetchStockData = async () => {
    try {
      const [nyseData, nasdaqData, bistData] = await Promise.all([
        supabase.from("nyse_stocks").select("*").order("market_cap", { ascending: false }),
        supabase.from("nasdaq_stocks").select("*").order("market_cap", { ascending: false }),
        supabase.from("bist_stocks").select("*").order("market_cap", { ascending: false }),
      ])

      if (nyseData.data) setNyseStocks(nyseData.data)
      if (nasdaqData.data) setNasdaqStocks(nasdaqData.data)
      if (bistData.data) setBistStocks(bistData.data)
    } catch (error) {
      console.error("Error fetching stock data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch stock data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateBistData = async () => {
    setUpdating(true)
    try {
      const response = await fetch("/api/update-bist", {
        method: "POST",
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        // Refresh BIST data
        const bistData = await supabase.from("bist_stocks").select("*").order("market_cap", { ascending: false })
        if (bistData.data) setBistStocks(bistData.data)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error updating BIST data:", error)
      toast({
        title: "Error",
        description: "Failed to update BIST data",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toLocaleString()}`
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`
    return volume.toLocaleString()
  }

  const filterStocks = (stocks: Stock[]) => {
    if (!searchQuery) return stocks
    return stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.sector.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  const StockTable = ({ stocks, exchange }: { stocks: Stock[]; exchange: string }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">{exchange} Stocks</h3>
          <Badge variant="secondary">{stocks.length} companies</Badge>
        </div>
        {exchange === "BIST" && (
          <Button
            onClick={updateBistData}
            disabled={updating}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${updating ? "animate-spin" : ""}`} />
            {updating ? "Updating..." : "Update BIST Data"}
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Market Cap</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>P/E</TableHead>
              <TableHead>Dividend</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterStocks(stocks)
              .slice(0, 50)
              .map((stock) => (
                <TableRow key={stock.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {stock.symbol.charAt(0)}
                      </div>
                      {stock.symbol}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{stock.company_name}</div>
                      <div className="text-sm text-muted-foreground">{stock.sector}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {exchange === "BIST" ? "₺" : "$"}
                    {stock.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {stock.change_percent >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={stock.change_percent >= 0 ? "text-green-600" : "text-red-600"}>
                        {stock.change_percent >= 0 ? "+" : ""}
                        {stock.change_percent.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatMarketCap(stock.market_cap)}</TableCell>
                  <TableCell>{formatVolume(stock.volume)}</TableCell>
                  <TableCell>{stock.pe_ratio ? stock.pe_ratio.toFixed(1) : "N/A"}</TableCell>
                  <TableCell>{stock.dividend_yield ? `${stock.dividend_yield.toFixed(1)}%` : "N/A"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading market data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Global Markets
            </h1>
            <p className="text-muted-foreground">Real-time data from NYSE, NASDAQ, and BIST exchanges</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        {/* Market Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-blue-100 dark:border-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NYSE</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nyseStocks.length}</div>
              <p className="text-xs text-muted-foreground">Listed Companies</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">+2.4% today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 dark:border-purple-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NASDAQ</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nasdaqStocks.length}</div>
              <p className="text-xs text-muted-foreground">Tech Companies</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">+1.8% today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 dark:border-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">BIST</CardTitle>
              <Globe className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bistStocks.length}</div>
              <p className="text-xs text-muted-foreground">Turkish Companies</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">+3.2% today</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Tables */}
        <Tabs defaultValue="nyse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="nyse" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              NYSE
            </TabsTrigger>
            <TabsTrigger value="nasdaq" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              NASDAQ
            </TabsTrigger>
            <TabsTrigger value="bist" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              BIST
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nyse">
            <Card>
              <CardHeader>
                <CardTitle>New York Stock Exchange</CardTitle>
                <CardDescription>The world's largest stock exchange by market capitalization</CardDescription>
              </CardHeader>
              <CardContent>
                <StockTable stocks={nyseStocks} exchange="NYSE" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nasdaq">
            <Card>
              <CardHeader>
                <CardTitle>NASDAQ</CardTitle>
                <CardDescription>Technology-focused stock exchange with innovative companies</CardDescription>
              </CardHeader>
              <CardContent>
                <StockTable stocks={nasdaqStocks} exchange="NASDAQ" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bist">
            <Card>
              <CardHeader>
                <CardTitle>Borsa Istanbul</CardTitle>
                <CardDescription>Turkey's primary stock exchange serving the Turkish market</CardDescription>
              </CardHeader>
              <CardContent>
                <StockTable stocks={bistStocks} exchange="BIST" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
