import type { Portfolio, PortfolioPosition, Transaction, CreateTransactionRequest } from "../entities/Portfolio"

export interface IPortfolioRepository {
  findById(id: string): Promise<Portfolio | null>
  findByUserId(userId: string): Promise<Portfolio[]>
  create(portfolioData: Omit<Portfolio, "id" | "createdAt" | "updatedAt">): Promise<Portfolio>
  update(id: string, portfolioData: Partial<Portfolio>): Promise<Portfolio>
  delete(id: string): Promise<void>

  // Position methods
  getPositions(portfolioId: string): Promise<PortfolioPosition[]>
  getPosition(portfolioId: string, stockId: string): Promise<PortfolioPosition | null>
  updatePosition(position: PortfolioPosition): Promise<PortfolioPosition>
  deletePosition(portfolioId: string, stockId: string): Promise<void>

  // Transaction methods
  getTransactions(portfolioId: string, limit?: number, offset?: number): Promise<Transaction[]>
  addTransaction(transactionData: CreateTransactionRequest): Promise<Transaction>

  // Portfolio calculations
  calculatePortfolioValue(portfolioId: string): Promise<number>
  calculatePortfolioPnL(portfolioId: string): Promise<{ realized: number; unrealized: number }>
}
