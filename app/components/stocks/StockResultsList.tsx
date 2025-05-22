"use client"

import { motion } from "framer-motion"
import type { StockData } from "@/lib/stockService"

interface StockResultsListProps {
  results: StockData[]
  onSelect: (symbol: string) => void
}

export function StockResultsList({ results, onSelect }: StockResultsListProps) {
  return (
    <motion.ul
      className="mt-4 glass-effect shadow-lg rounded-lg overflow-hidden w-full max-w-3xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {results.length === 0 ? (
        <li className="p-4 text-center text-muted-foreground">No results found</li>
      ) : (
        results.map((stock) => (
          <motion.li
            key={stock.symbol}
            className="p-4 border-b last:border-b-0 cursor-pointer hover:bg-primary/10 transition-colors"
            onClick={() => onSelect(stock.symbol)}
            whileHover={{ x: 5 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{stock.symbol}</h3>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{stock.exchange}</span>
                </div>
                <p className="text-sm text-muted-foreground">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${stock.price.toFixed(2)}</p>
                <p className={`text-sm ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </p>
              </div>
            </div>
          </motion.li>
        ))
      )}
    </motion.ul>
  )
}
