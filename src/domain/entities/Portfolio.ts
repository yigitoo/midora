export interface Portfolio {
  id: string
  userId: string
  name: string
  description?: string
  initialBalance: number
  currentBalance: number
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PortfolioPosition {
  id: string
  portfolioId: string
  stockId: string
  quantity: number
  averagePrice: number
  currentPrice?: number
  totalValue?: number
  unrealizedPnl?: number
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  portfolioId: string
  stockId: string
  type: "buy" | "sell"
  quantity: number
  price: number
  totalAmount: number
  fees: number
  executedAt: Date
  createdAt: Date
}

export interface CreateTransactionRequest {
  portfolioId: string
  stockId: string
  type: "buy" | "sell"
  quantity: number
  price: number
  fees?: number
}
