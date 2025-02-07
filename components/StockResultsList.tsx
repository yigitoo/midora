import { motion } from "framer-motion"
import type { Stock } from "../lib/mockStockApi"

interface StockResultsListProps {
  results: Stock[]
  onSelect: (symbol: string) => void
}

export function StockResultsList({ results, onSelect }: StockResultsListProps) {
  return (
    <motion.ul
      className="mt-4 bg-secondary shadow-lg rounded-lg overflow-hidden w-full max-w-3xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {results.map((stock) => (
        <motion.li
          key={stock.symbol}
          className="shadow-blue-500/50 p-4 border-b last:border-b-0 cursor-pointer "
          onClick={() => onSelect(stock.symbol)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{stock.symbol}</h3>
              <p className="text-sm text-primary">{stock.name}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">${stock.price.toFixed(2)}</p>
              <p className={`text-sm ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                {stock.change >= 0 ? "+" : ""}
                {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </p>
            </div>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  )
}

