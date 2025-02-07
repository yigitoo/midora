'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StockFiltersProps {
  onFilterChange: (filters: StockFilters) => void
}

export interface StockFilters {
  industry: string
  marketCap: string
  volume: [number, number]
  priceRange: [number, number]
}

const industries = [
  "All",
  "Technology",
  "Healthcare",
  "Finance",
  "Consumer Goods",
  "Energy",
  "Industrials",
  "Materials",
  "Utilities",
  "Real Estate",
  "Communication Services",
]

const marketCapOptions = [
  { value: "all", label: "All" },
  { value: "micro", label: "Micro ($50M to $300M)" },
  { value: "small", label: "Small ($300M to $2B)" },
  { value: "mid", label: "Mid ($2B to $10B)" },
  { value: "large", label: "Large ($10B to $200B)" },
  { value: "mega", label: "Mega (> $200B)" },
]

export function StockFilters({ onFilterChange }: StockFiltersProps) {
  const [filters, setFilters] = useState<StockFilters>({
    industry: "All",
    marketCap: "all",
    volume: [0, 100],
    priceRange: [0, 1000],
  })

  const handleFilterChange = (key: keyof StockFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <motion.div
      className="sm:mx-2 md:w-[65vw] border shadow-blue-500/50 bg-secondary p-4 rounded-lg shadow-lg mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-4">Filtreler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Endüstri</label>
          <Select onValueChange={(value) => handleFilterChange("industry", value)} defaultValue={filters.industry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Market Cap</label>
          <Select onValueChange={(value) => handleFilterChange("marketCap", value)} defaultValue={filters.marketCap}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select market cap" />
            </SelectTrigger>
            <SelectContent>
              {marketCapOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Volume (Million)</label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={filters.volume}
            onValueChange={(value) => handleFilterChange("volume", value)}
            className="mt-2"
          />
          <div className="flex justify-between mt-1 text-xs text-gray-600">
            <span>{filters.volume[0]}M</span>
            <span>{filters.volume[1]}M</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Price Range ($)</label>
          <Slider
            min={0}
            max={1000}
            step={10}
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange("priceRange", value)}
            className="mt-2"
          />
          <div className="flex justify-between mt-1 text-xs text-gray-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

