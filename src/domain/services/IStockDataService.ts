import type { Stock, StockPrice, StockQuote } from "../entities/Stock"

export interface IStockDataService {
  searchStocks(query: string, exchange?: string): Promise<Stock[]>
  getStockQuote(symbol: string, exchange?: string): Promise<StockQuote | null>
  getHistoricalPrices(symbol: string, exchange: string, from: Date, to: Date): Promise<StockPrice[]>
  getTopStocks(exchange: string, limit?: number): Promise<StockQuote[]>
  refreshStockData(symbol: string, exchange: string): Promise<void>
}
