import type { Stock, StockPrice, StockQuote, StockSearchResult } from "../entities/Stock"

export interface IStockRepository {
  findById(id: string): Promise<Stock | null>
  findBySymbol(symbol: string, exchange?: string): Promise<Stock | null>
  search(query: string, exchange?: string, limit?: number, offset?: number): Promise<StockSearchResult>
  create(stockData: Omit<Stock, "id" | "createdAt" | "updatedAt">): Promise<Stock>
  update(id: string, stockData: Partial<Stock>): Promise<Stock>

  // Price methods
  getLatestPrice(stockId: string): Promise<StockPrice | null>
  getPriceHistory(stockId: string, from: Date, to: Date): Promise<StockPrice[]>
  addPrice(priceData: Omit<StockPrice, "id" | "createdAt">): Promise<StockPrice>

  // Quote methods
  getQuote(stockId: string): Promise<StockQuote | null>
  getQuotes(stockIds: string[]): Promise<Record<string, StockQuote>>

  // Exchange methods
  getTopStocks(exchange: string, limit?: number): Promise<Stock[]>
  getAllActiveStocks(exchange?: string): Promise<Stock[]>
}
