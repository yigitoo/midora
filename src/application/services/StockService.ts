import type { IStockRepository } from "../../domain/repositories/IStockRepository"
import type { IStockDataService } from "../../domain/services/IStockDataService"
import type { ICacheService } from "../../domain/services/ICacheService"
import type { Stock, StockQuote, StockPrice } from "../../domain/entities/Stock"

export class StockService {
  constructor(
    private stockRepository: IStockRepository,
    private stockDataService: IStockDataService,
    private cache: ICacheService,
  ) {}

  async searchStocks(query: string, exchange?: string): Promise<Stock[]> {
    if (!query.trim()) return []

    try {
      // First try database search
      const dbResult = await this.stockRepository.search(query, exchange, 20, 0)

      // If we have good results from DB, return them
      if (dbResult.stocks.length >= 5) {
        return dbResult.stocks
      }

      // Otherwise, fetch from external API and merge results
      const apiStocks = await this.stockDataService.searchStocks(query, exchange)

      // Combine and deduplicate results
      const allStocks = [...dbResult.stocks]
      const existingSymbols = new Set(dbResult.stocks.map((s) => `${s.symbol}:${s.exchange}`))

      for (const apiStock of apiStocks) {
        const key = `${apiStock.symbol}:${apiStock.exchange}`
        if (!existingSymbols.has(key)) {
          allStocks.push(apiStock)
        }
      }

      return allStocks.slice(0, 20)
    } catch (error) {
      console.error("Error in stock search:", error)
      throw new Error("Failed to search stocks")
    }
  }

  async getStockQuote(symbol: string, exchange?: string): Promise<StockQuote | null> {
    try {
      // Try to find stock in database first
      const stock = await this.stockRepository.findBySymbol(symbol, exchange)

      if (stock) {
        // Check if we have recent cached quote
        const cachedQuote = await this.cache.getStockQuote(symbol, stock.exchange)
        if (cachedQuote) return cachedQuote

        // Get quote from database
        const dbQuote = await this.stockRepository.getQuote(stock.id)
        if (dbQuote) {
          // Check if price is recent (within 5 minutes)
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
          if (dbQuote.currentPrice.timestamp > fiveMinutesAgo) {
            await this.cache.setStockQuote(symbol, stock.exchange, dbQuote, 60)
            return dbQuote
          }
        }
      }

      // Fetch fresh data from external API
      const quote = await this.stockDataService.getStockQuote(symbol, exchange || "NYSE")
      return quote
    } catch (error) {
      console.error(`Error getting quote for ${symbol}:`, error)
      return null
    }
  }

  async getHistoricalPrices(symbol: string, exchange: string, from: Date, to: Date): Promise<StockPrice[]> {
    try {
      const stock = await this.stockRepository.findBySymbol(symbol, exchange)
      if (!stock) {
        throw new Error(`Stock ${symbol} not found`)
      }

      // Try database first
      const dbPrices = await this.stockRepository.getPriceHistory(stock.id, from, to)

      // If we have sufficient data in DB, return it
      const expectedDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
      if (dbPrices.length >= expectedDays * 0.8) {
        // 80% coverage threshold
        return dbPrices
      }

      // Otherwise fetch from external API
      const apiPrices = await this.stockDataService.getHistoricalPrices(symbol, exchange, from, to)

      // Save new prices to database
      for (const price of apiPrices) {
        try {
          await this.stockRepository.addPrice({
            ...price,
            stockId: stock.id,
          })
        } catch (error) {
          // Price might already exist, ignore duplicate errors
        }
      }

      return apiPrices
    } catch (error) {
      console.error(`Error getting historical prices for ${symbol}:`, error)
      throw new Error("Failed to get historical prices")
    }
  }

  async getTopStocks(exchange: string, limit = 20): Promise<StockQuote[]> {
    try {
      const cacheKey = `top_stocks:${exchange}:${limit}`

      // Try cache first
      const cached = await this.cache.get<StockQuote[]>(cacheKey)
      if (cached) return cached

      // Get from external service
      const quotes = await this.stockDataService.getTopStocks(exchange, limit)

      // Cache for 5 minutes
      await this.cache.set(cacheKey, quotes, 300)

      return quotes
    } catch (error) {
      console.error(`Error getting top stocks for ${exchange}:`, error)
      throw new Error("Failed to get top stocks")
    }
  }

  async refreshAllStockData(exchange?: string): Promise<void> {
    try {
      const stocks = await this.stockRepository.getAllActiveStocks(exchange)

      // Refresh in batches to avoid rate limits
      const batchSize = 5
      for (let i = 0; i < stocks.length; i += batchSize) {
        const batch = stocks.slice(i, i + batchSize)

        await Promise.all(
          batch.map(async (stock) => {
            try {
              await this.stockDataService.refreshStockData(stock.symbol, stock.exchange)
            } catch (error) {
              console.error(`Failed to refresh ${stock.symbol}:`, error)
            }
          }),
        )

        // Wait 1 second between batches to respect rate limits
        if (i + batchSize < stocks.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }
    } catch (error) {
      console.error("Error refreshing stock data:", error)
      throw new Error("Failed to refresh stock data")
    }
  }

  async getMultipleQuotes(symbols: { symbol: string; exchange: string }[]): Promise<Record<string, StockQuote>> {
    try {
      const quotes: Record<string, StockQuote> = {}

      // Try to get cached quotes first
      const cacheKeys = symbols.map((s) => `stock:quote:${s.exchange}:${s.symbol}`)
      const cachedQuotes = await this.cache.getMultipleStockQuotes(cacheKeys)

      // Identify which quotes we need to fetch
      const quotesToFetch: { symbol: string; exchange: string }[] = []

      for (const { symbol, exchange } of symbols) {
        const cacheKey = `stock:quote:${exchange}:${symbol}`
        if (cachedQuotes[cacheKey]) {
          quotes[`${symbol}:${exchange}`] = cachedQuotes[cacheKey]
        } else {
          quotesToFetch.push({ symbol, exchange })
        }
      }

      // Fetch missing quotes
      for (const { symbol, exchange } of quotesToFetch) {
        try {
          const quote = await this.getStockQuote(symbol, exchange)
          if (quote) {
            quotes[`${symbol}:${exchange}`] = quote
          }
        } catch (error) {
          console.error(`Failed to get quote for ${symbol}:`, error)
        }
      }

      return quotes
    } catch (error) {
      console.error("Error getting multiple quotes:", error)
      throw new Error("Failed to get stock quotes")
    }
  }
}
