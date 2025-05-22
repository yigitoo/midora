"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { SearchBox } from "@/app/components/stocks/SearchBox"
import { StockResultsList } from "@/app/components/stocks/StockResultsList"
import { StockFilters } from "@/app/components/stocks/StockFilters"
import { TopStocks } from "@/app/components/stocks/TopStocks"
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { API_URL, URL_MAP } from "@/lib/urls"
import type { StockData } from "@/lib/stockService"

export default function StocksPage() {
  const [searchResults, setSearchResults] = useState<StockData[]>([])
  const [topStocks, setTopStocks] = useState<StockData[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeExchange, setActiveExchange] = useState<string>("NYSE")
  const [isSmallSearch, setIsSmallSearch] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchTopStocks(activeExchange)
  }, [activeExchange])

  const fetchTopStocks = async (exchange: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL.stockTopApiEndpoint}?exchange=${exchange}&limit=10`)
      if (!response.ok) throw new Error("Failed to fetch top stocks")
      const data = await response.json()
      setTopStocks(data)
    } catch (error) {
      console.error("Error fetching top stocks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      setIsSearching(true)
      const response = await fetch(
        `${API_URL.stockSearchApiEndpoint}?q=${encodeURIComponent(query)}&exchange=${activeExchange}`,
      )
      if (!response.ok) throw new Error("Search failed")
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleFilterChange = async (filters: any) => {
    try {
      setIsLoading(true)

      // Build query string from filters
      const params = new URLSearchParams()
      params.append("exchange", activeExchange)

      if (filters.industry && filters.industry !== "All") {
        params.append("industry", filters.industry)
      }

      if (filters.marketCap && filters.marketCap !== "all") {
        params.append("marketCap", filters.marketCap)
      }

      if (filters.volume) {
        params.append("volumeMin", filters.volume[0].toString())
        params.append("volumeMax", filters.volume[1].toString())
      }

      if (filters.priceRange) {
        params.append("priceMin", filters.priceRange[0].toString())
        params.append("priceMax", filters.priceRange[1].toString())
      }

      const response = await fetch(`${API_URL.stockFilterApiEndpoint}?${params.toString()}`)
      if (!response.ok) throw new Error("Filter failed")
      const data = await response.json()
      setTopStocks(data)
    } catch (error) {
      console.error("Filter error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStockSelect = (symbol: string) => {
    router.push(`${URL_MAP.stockDetailsPage}/${symbol}?exchange=${activeExchange}`)
  }

  const handleSearchFocus = () => {
    setIsSmallSearch(false)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-4">Stock Explorer</h1>
        <p className="text-xl text-muted-foreground">Search and analyze stocks from major exchanges</p>
      </motion.div>

      <Tabs
        defaultValue="NYSE"
        value={activeExchange}
        onValueChange={(value) => {
          setActiveExchange(value)
          setSearchResults([])
        }}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-3">
          <TabsTrigger value="NYSE" className="px-8">
            NYSE
          </TabsTrigger>
          <TabsTrigger value="NASDAQ" className="px-8">
            NASDAQ
          </TabsTrigger>
          <TabsTrigger value="BIST" className="px-8">
            BIST
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col items-center">
        <SearchBox isSmall={isSmallSearch} onSearch={handleSearch} onFocus={handleSearchFocus} />

        {isSearching ? (
          <div className="flex justify-center my-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : searchResults.length > 0 ? (
          <StockResultsList results={searchResults} onSelect={handleStockSelect} />
        ) : null}

        <StockFilters onFilterChange={handleFilterChange} />

        {isLoading ? (
          <div className="flex justify-center my-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <TopStocks stocks={topStocks} onSelect={handleStockSelect} />
        )}
      </div>
    </div>
  )
}
