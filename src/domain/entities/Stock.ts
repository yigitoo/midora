export interface Stock {
  id: string
  symbol: string
  name: string
  exchange: "BIST" | "NYSE" | "NASDAQ"
  sector?: string
  industry?: string
  marketCap?: number
  currency: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface StockPrice {
  id: string
  stockId: string
  price: number
  openPrice?: number
  highPrice?: number
  lowPrice?: number
  volume?: number
  changeAmount?: number
  changePercent?: number
  timestamp: Date
  createdAt: Date
}

export interface StockQuote {
  stock: Stock
  currentPrice: StockPrice
  previousClose?: number
  dayChange: number
  dayChangePercent: number
  volume: number
  marketCap?: number
}

export interface StockSearchResult {
  stocks: Stock[]
  totalCount: number
  hasMore: boolean
}
