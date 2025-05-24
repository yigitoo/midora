"use client"

import { motion } from "framer-motion"
import type { StockData } from "@/lib/stockService"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TopStocksProps {
  stocks: StockData[]
  onSelect: (symbol: string) => void
}

export function TopStocks({ stocks, onSelect }: TopStocksProps) {
  return (
    <motion.div
      className="mt-8 w-full max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 gradient-text">Top Stocks</h2>
      <div className="mx-auto md:w-[65vw] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stocks.map((stock, index) => (
          <motion.div
            key={stock.symbol}
            className="stock-card cursor-pointer"
            whileHover={{ scale: 1.03 }}
            onClick={() => onSelect(stock.symbol)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{stock.symbol}</h3>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{stock.exchange}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${stock.price.toFixed(2)}</p>
                <div className={`flex items-center gap-1 ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <p className="text-sm">
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Market Cap</p>
                  <p className="font-medium">${(stock.marketCap / 1e9).toFixed(2)}B</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Volume</p>
                  <p className="font-medium">{(stock.volume / 1e6).toFixed(2)}M</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
