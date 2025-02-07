'use client'

import { motion } from "framer-motion"
import type { Stock } from "../lib/mockStockApi"

interface TopStocksProps {
  stocks: Stock[]
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
      <h2 className="text-2xl font-bold mb-4 text-primary">En yüksek 30 hisse</h2>
      <div className="mx-auto md:w-[65vw] grid grid-cols-1 md:grid-cols-5 gap-4">
        {stocks.map((stock) => (
          <motion.div
            key={stock.symbol}
            className="shadow-blue-500/50 bg-secondary p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
            whileHover={{ scale: 1.02 }}
            onClick={() => onSelect(stock.symbol)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{stock.symbol}</h3>
                <p className="text-sm text-gray-600">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${stock.price.toFixed(2)}</p>
                <p className={`text-sm ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

