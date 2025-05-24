import type { Stock } from "./Stock"
import type { StockQuote } from "./StockQuote"

export interface Watchlist {
  id: string
  userId: string
  name: string
  description?: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface WatchlistItem {
  id: string
  watchlistId: string
  stockId: string
  addedAt: Date
}

export interface WatchlistWithStocks {
  watchlist: Watchlist
  stocks: Stock[]
  quotes: Record<string, StockQuote>
}
