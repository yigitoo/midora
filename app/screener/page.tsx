"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, TrendingUp, TrendingDown, BarChart3, Star } from "lucide-react"
import Link from "next/link"
import { formatPrice, formatNumber } from "@/lib/utils"
import type { ScreenerFilters, ScreenerResult } from "@/lib/market-screener"

export default function ScreenerPage() {
  const [results, setResults] = useState<ScreenerResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [presets, setPresets] = useState<string[]>([])
  const [filters, setFilters] = useState<ScreenerFilters>({
    exchange: "ALL",
    sortBy: "marketCap",
    sortOrder: "desc",
    limit: 50,
  })

  useEffect(() => {
    fetchPresets()
    runScreen()
  }, [])

  const fetchPresets = async () => {
    try {
      const response = await fetch("/api/screener")
      const data = await response.json()
      setPresets(data.presets || [])
    } catch (error) {
      console.error("Error fetching presets:", error)
    }
  }

  const runScreen = async (customFilters?: ScreenerFilters) => {
    try {
      setLoading(true)
      const response = await fetch("/api/screener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customFilters || filters),
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error running screen:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadPreset = async (presetName: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/screener?preset=${encodeURIComponent(presetName)}`)
      const data = await response.json()
      setResults(data)
      // Update filters to match preset (you'd get this from the API response)
    } catch (error) {
      console.error("Error loading preset:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateFilter = (key: keyof ScreenerFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      exchange: "ALL",
      sortBy: "marketCap",
      sortOrder: "desc",
      limit: 50,
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Market Screener</h1>
        <p className="text-muted-foreground">Find stocks that match your investment criteria</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preset Screens */}
              <div>
                <Label className="text-sm font-medium">Quick Screens</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {presets.slice(0, 6).map((preset) => (
                    <Button
                      key={preset}
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset(preset)}
                      className="justify-start text-xs"
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Exchange Filter */}
              <div>
                <Label htmlFor="exchange">Exchange</Label>
                <Select value={filters.exchange} onValueChange={(value) => updateFilter("exchange", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Exchanges</SelectItem>
                    <SelectItem value="NYSE">NYSE</SelectItem>
                    <SelectItem value="NASDAQ">NASDAQ</SelectItem>
                    <SelectItem value="BIST">BIST</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Market Cap Filter */}
              <div>
                <Label>Market Cap (USD)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.marketCapMin || ""}
                    onChange={(e) => updateFilter("marketCapMin", Number(e.target.value) || undefined)}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.marketCapMax || ""}
                    onChange={(e) => updateFilter("marketCapMax", Number(e.target.value) || undefined)}
                  />
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <Label>Price Range</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.priceMin || ""}
                    onChange={(e) => updateFilter("priceMin", Number(e.target.value) || undefined)}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.priceMax || ""}
                    onChange={(e) => updateFilter("priceMax", Number(e.target.value) || undefined)}
                  />
                </div>
              </div>

              {/* P/E Ratio Filter */}
              <div>
                <Label>P/E Ratio</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.peRatioMin || ""}
                    onChange={(e) => updateFilter("peRatioMin", Number(e.target.value) || undefined)}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.peRatioMax || ""}
                    onChange={(e) => updateFilter("peRatioMax", Number(e.target.value) || undefined)}
                  />
                </div>
              </div>

              {/* Dividend Yield Filter */}
              <div>
                <Label>Dividend Yield (%)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.dividendYieldMin || ""}
                    onChange={(e) => updateFilter("dividendYieldMin", Number(e.target.value) || undefined)}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.dividendYieldMax || ""}
                    onChange={(e) => updateFilter("dividendYieldMax", Number(e.target.value) || undefined)}
                  />
                </div>
              </div>

              {/* Change Percent Filter */}
              <div>
                <Label>Daily Change (%)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.changePercentMin || ""}
                    onChange={(e) => updateFilter("changePercentMin", Number(e.target.value) || undefined)}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.changePercentMax || ""}
                    onChange={(e) => updateFilter("changePercentMax", Number(e.target.value) || undefined)}
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <Label>Sort By</Label>
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketCap">Market Cap</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="changePercent">Change %</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                    <SelectItem value="pe">P/E Ratio</SelectItem>
                    <SelectItem value="dividendYield">Dividend Yield</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => runScreen()} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Screen
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{results ? `${results.totalCount} Stocks Found` : "Market Screener Results"}</CardTitle>
                {results && (
                  <Badge variant="secondary">
                    Showing {Math.min(results.stocks.length, filters.limit || 50)} of {results.totalCount}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded"></div>
                        <div>
                          <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-32"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 bg-muted rounded w-16 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-12"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : results && results.stocks.length > 0 ? (
                <div className="space-y-2">
                  {results.stocks.map((stock) => (
                    <motion.div
                      key={`${stock.symbol}-${stock.exchange}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 border rounded hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                          <span className="font-bold text-primary">{stock.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/stocks/${stock.symbol}?exchange=${stock.exchange}`}
                              className="font-semibold hover:text-primary"
                            >
                              {stock.symbol}
                            </Link>
                            <Badge variant="outline" className="text-xs">
                              {stock.exchange}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">{stock.name}</p>
                          {stock.industry && <p className="text-xs text-muted-foreground">{stock.industry}</p>}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold">{formatPrice(stock.price, stock.currency)}</div>
                        <div
                          className={`flex items-center gap-1 text-sm ${
                            stock.change >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {stock.change >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span>
                            {stock.change >= 0 ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      <div className="text-right text-sm text-muted-foreground">
                        <div>MC: {formatNumber(stock.marketCap)}</div>
                        <div>P/E: {stock.pe ? stock.pe.toFixed(1) : "N/A"}</div>
                        <div>Vol: {formatNumber(stock.volume)}</div>
                      </div>

                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No stocks found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or use a preset screen</p>
                  <Button onClick={() => runScreen()}>
                    <Search className="h-4 w-4 mr-2" />
                    Run Default Screen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
