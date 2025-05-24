import axios from "axios"
import type { IStockDataService } from "../../domain/services/IStockDataService"
import type { ICacheService } from "../../domain/services/ICacheService"
import type { IStockRepository } from "../../domain/repositories/IStockRepository"
import type { Stock, StockPrice, StockQuote } from "../../domain/entities/Stock"

export class AlphaVantageStockService implements IStockDataService {
  private apiKey: string
  private baseUrl = "https://www.alphavantage.co/query"
  private cache: ICacheService
  private stockRepository: IStockRepository

  constructor(cache: ICacheService, stockRepository: IStockRepository) {
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || "demo"
    this.cache = cache
    this.stockRepository = stockRepository
  }

  async searchStocks(query: string, exchange?: string): Promise<Stock[]> {
    const cacheKey = `search:${query}:${exchange || "all"}`

    // Try cache first
    const cached = await this.cache.get<Stock[]>(cacheKey)
    if (cached) return cached

    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: "SYMBOL_SEARCH",
          keywords: query,
          apikey: this.apiKey,
        },
      })

      if (response.data.Note) {
        console.warn("Alpha Vantage API limit reached")
        return []
      }

      const matches = response.data.bestMatches || []
      const stocks: Stock[] = []

      for (const match of matches.slice(0, 10)) {
        const symbol = match["1. symbol"]
        const name = match["2. name"]
        const region = match["4. region"]
        const stockExchange = this.mapRegionToExchange(region)

        if (exchange && stockExchange !== exchange) continue

        // Check if stock exists in database, create if not
        let stock = await this.stockRepository.findBySymbol(symbol, stockExchange)

        if (!stock) {
          try {
            stock = await this.stockRepository.create({
              symbol,
              name,
              exchange: stockExchange,
              currency: stockExchange === "BIST" ? "TRY" : "USD",
              isActive: true,
            })
          } catch (error) {
            console.error(`Failed to create stock ${symbol}:`, error)
            continue
          }
        }

        stocks.push(stock)
      }

      // Cache results for 5 minutes
      await this.cache.set(cacheKey, stocks, 300)
      return stocks
    } catch (error) {
      console.error("Error searching stocks:", error)
      return []
    }
  }

  async getStockQuote(symbol: string, exchange = "NYSE"): Promise<StockQuote | null> {
    // Try cache first
    const cached = await this.cache.getStockQuote(symbol, exchange)
    if (cached) return cached

    try {
      // For BIST stocks, use mock data since Alpha Vantage has limited coverage
      if (exchange === "BIST") {
        return this.getBistStockQuote(symbol)
      }

      const response = await axios.get(this.baseUrl, {
        params: {
          function: "GLOBAL_QUOTE",
          symbol: symbol,
          apikey: this.apiKey,
        },
      })

      if (response.data.Note) {
        console.warn("Alpha Vantage API limit reached")
        return null
      }

      const quote = response.data["Global Quote"]
      if (!quote || !quote["01. symbol"]) return null

      // Get or create stock in database
      let stock = await this.stockRepository.findBySymbol(symbol, exchange)
      if (!stock) {
        // Fetch company overview for additional details
        const overviewResponse = await axios.get(this.baseUrl, {
          params: {
            function: "OVERVIEW",
            symbol: symbol,
            apikey: this.apiKey,
          },
        })

        const overview = overviewResponse.data

        stock = await this.stockRepository.create({
          symbol: quote["01. symbol"],
          name: overview.Name || symbol,
          exchange: this.mapRegionToExchange(overview.Exchange) || exchange,
          sector: overview.Sector,
          industry: overview.Industry,
          marketCap: overview.MarketCapitalization ? Number.parseInt(overview.MarketCapitalization) : undefined,
          currency: "USD",
          isActive: true,
        })
      }

      // Create price record
      const price = Number.parseFloat(quote["05. price"])
      const change = Number.parseFloat(quote["09. change"])
      const changePercent = Number.parseFloat(quote["10. change percent"].replace("%", ""))

      const stockPrice: StockPrice = {
        id: "", // Will be set by repository
        stockId: stock.id,
        price,
        openPrice: Number.parseFloat(quote["02. open"]),
        highPrice: Number.parseFloat(quote["03. high"]),
        lowPrice: Number.parseFloat(quote["04. low"]),
        volume: Number.parseInt(quote["06. volume"]),
        changeAmount: change,
        changePercent,
        timestamp: new Date(),
        createdAt: new Date(),
      }

      // Save price to database
      await this.stockRepository.addPrice(stockPrice)

      const stockQuote: StockQuote = {
        stock,
        currentPrice: stockPrice,
        previousClose: Number.parseFloat(quote["08. previous close"]),
        dayChange: change,
        dayChangePercent: changePercent,
        volume: Number.parseInt(quote["06. volume"]),
        marketCap: stock.marketCap,
      }

      // Cache for 1 minute
      await this.cache.setStockQuote(symbol, exchange, stockQuote, 60)
      return stockQuote
    } catch (error) {
      console.error(`Error getting quote for ${symbol}:`, error)
      return null
    }
  }

  async getHistoricalPrices(symbol: string, exchange: string, from: Date, to: Date): Promise<StockPrice[]> {
    const cacheKey = `historical:${symbol}:${exchange}:${from.toISOString()}:${to.toISOString()}`

    // Try cache first
    const cached = await this.cache.get<StockPrice[]>(cacheKey)
    if (cached) return cached

    try {
      if (exchange === "BIST") {
        return this.getBistHistoricalPrices(symbol, from, to)
      }

      const response = await axios.get(this.baseUrl, {
        params: {
          function: "TIME_SERIES_DAILY",
          symbol: symbol,
          outputsize: "full",
          apikey: this.apiKey,
        },
      })

      if (response.data.Note) {
        console.warn("Alpha Vantage API limit reached")
        return []
      }

      const timeSeries = response.data["Time Series (Daily)"]
      if (!timeSeries) return []

      const stock = await this.stockRepository.findBySymbol(symbol, exchange)
      if (!stock) return []

      const prices: StockPrice[] = []

      Object.entries(timeSeries).forEach(([date, values]: [string, any]) => {
        const priceDate = new Date(date)
        if (priceDate >= from && priceDate <= to) {
          prices.push({
            id: "",
            stockId: stock.id,
            price: Number.parseFloat(values["4. close"]),
            openPrice: Number.parseFloat(values["1. open"]),
            highPrice: Number.parseFloat(values["2. high"]),
            lowPrice: Number.parseFloat(values["3. low"]),
            volume: Number.parseInt(values["5. volume"]),
            timestamp: priceDate,
            createdAt: new Date(),
          })
        }
      })

      // Sort by date ascending
      prices.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

      // Cache for 1 hour
      await this.cache.set(cacheKey, prices, 3600)
      return prices
    } catch (error) {
      console.error(`Error getting historical prices for ${symbol}:`, error)
      return []
    }
  }

  async getTopStocks(exchange: string, limit = 20): Promise<StockQuote[]> {
    const cacheKey = `top:${exchange}:${limit}`

    // Try cache first
    const cached = await this.cache.get<StockQuote[]>(cacheKey)
    if (cached) return cached

    try {
      const stocks = await this.stockRepository.getTopStocks(exchange, limit)
      const quotes: StockQuote[] = []

      for (const stock of stocks) {
        const quote = await this.getStockQuote(stock.symbol, stock.exchange)
        if (quote) {
          quotes.push(quote)
        }
      }

      // Cache for 5 minutes
      await this.cache.set(cacheKey, quotes, 300)
      return quotes
    } catch (error) {
      console.error(`Error getting top stocks for ${exchange}:`, error)
      return []
    }
  }

  async refreshStockData(symbol: string, exchange: string): Promise<void> {
    // Clear cache and fetch fresh data
    await this.cache.delete(`stock:quote:${exchange}:${symbol}`)
    await this.getStockQuote(symbol, exchange)
  }

  private mapRegionToExchange(region: string): "BIST" | "NYSE" | "NASDAQ" {
    if (region?.includes("Istanbul") || region?.includes("Turkey")) return "BIST"
    if (region?.includes("NYSE")) return "NYSE"
    return "NASDAQ"
  }

  private async getBistStockQuote(symbol: string): Promise<StockQuote | null> {
    // Mock BIST data - in production, you'd use a real BIST API
    const bistStocks: Record<string, any> = {
      THYAO: { name: "Türk Hava Yolları", price: 245.6, change: 3.2, volume: 15000000 },
      GARAN: { name: "Garanti Bankası", price: 36.42, change: 0.42, volume: 25000000 },
      ASELS: { name: "Aselsan", price: 33.78, change: -0.22, volume: 8000000 },
      KCHOL: { name: "Koç Holding", price: 93.15, change: 1.15, volume: 12000000 },
      TUPRS: { name: "Tüpraş", price: 145.3, change: 2.3, volume: 5000000 },
    }

    const stockData = bistStocks[symbol]
    if (!stockData) return null

    let stock = await this.stockRepository.findBySymbol(symbol, "BIST")
    if (!stock) {
      stock = await this.stockRepository.create({
        symbol,
        name: stockData.name,
        exchange: "BIST",
        currency: "TRY",
        isActive: true,
      })
    }

    const currentPrice: StockPrice = {
      id: "",
      stockId: stock.id,
      price: stockData.price,
      volume: stockData.volume,
      changeAmount: stockData.change,
      changePercent: (stockData.change / (stockData.price - stockData.change)) * 100,
      timestamp: new Date(),
      createdAt: new Date(),
    }

    return {
      stock,
      currentPrice,
      previousClose: stockData.price - stockData.change,
      dayChange: stockData.change,
      dayChangePercent: currentPrice.changePercent || 0,
      volume: stockData.volume,
    }
  }

  private async getBistHistoricalPrices(symbol: string, from: Date, to: Date): Promise<StockPrice[]> {
    // Mock historical data for BIST stocks
    const stock = await this.stockRepository.findBySymbol(symbol, "BIST")
    if (!stock) return []

    const prices: StockPrice[] = []
    const basePrice = 100 + Math.random() * 100
    const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))

    for (let i = 0; i < days; i++) {
      const date = new Date(from)
      date.setDate(from.getDate() + i)

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue

      const dailyChange = (Math.random() - 0.5) * 0.04 // 4% max daily change
      const price = basePrice * (1 + dailyChange)

      prices.push({
        id: "",
        stockId: stock.id,
        price,
        openPrice: price * (1 - Math.random() * 0.01),
        highPrice: price * (1 + Math.random() * 0.01),
        lowPrice: price * (1 - Math.random() * 0.01),
        volume: Math.floor(Math.random() * 10000000),
        timestamp: date,
        createdAt: new Date(),
      })
    }

    return prices
  }
}
