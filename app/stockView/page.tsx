"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { SearchBox } from "@/components/SearchBox"
import { StockResultsList } from "@/components/StockResultsList"
import { StockDetails } from "@/components/StockDetails"
import { TopStocks } from "@/components/TopStocks"
import { StockFilters, type StockFilters as FilterType } from "@/components/StockFilters"
import { searchStocks, getStockDetails, getTopStocks, filterStocks, type Stock } from "@/lib/mockStockApi"
import { cn, removeElementsByClass } from "@/lib/utils"


export default function StockViewPage() {
  const [isSearchSmall, setIsSearchSmall] = useState(false)
  const [searchResults, setSearchResults] = useState<Stock[]>([])
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [topStocks, setTopStocks] = useState<Stock[]>([])
  const [filters, setFilters] = useState<FilterType>({
    industry: "All",
    marketCap: "all",
    volume: [0, 100],
    priceRange: [0, 1000],
  })

  useEffect(() => {
    setTopStocks(getTopStocks())
    if(!isSearchSmall) {
      setSelectedStock(null)
    }
  }, [])

  const handleSearch = (query: string) => {
    if (query.length > 0) {
      setSearchResults(searchStocks(query))
    } else {
      setSearchResults([])
    }
  }

  const handleStockSelect = (symbol: string) => {
    const stock = getStockDetails(symbol)
    if (stock) {
      setSelectedStock(stock)
      setIsSearchSmall(true)
      setSearchResults([])
    }
  }

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters)

    //@ts-ignore
    const filteredStocks = filterStocks(newFilters)
    setTopStocks(filteredStocks)
  }


  return (
    <main className="min-h-screen bg-secondary">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-8"
          animate={{
            height: isSearchSmall ? "auto" : "100vh",
          }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-full flex justify-center mb-8"
            animate={{
              justifyContent: isSearchSmall ? "flex-start" : "center",
              alignItems: isSearchSmall ? "flex-start" : "center",
            }}
            transition={{ duration: 0.5 }}
          >
            <SearchBox isSmall={isSearchSmall} onSearch={handleSearch} onFocus={() => setIsSearchSmall(false)} />
          </motion.div>
          {!isSearchSmall && <StockFilters onFilterChange={handleFilterChange} />}
          {!isSearchSmall && searchResults.length > 0 && (
            <StockResultsList results={searchResults} onSelect={handleStockSelect} />
          )}
          {!isSearchSmall && searchResults.length === 0 && (
            <TopStocks stocks={topStocks} onSelect={handleStockSelect} />
          )}
        </motion.div>
        {selectedStock && (
          <motion.div initial={{ opacity: 0 }} className={cn(!isSearchSmall ? "hidden" : "")} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <StockDetails stock={selectedStock} />
          </motion.div>
        )}
      </div>
    </main>
  )
}

