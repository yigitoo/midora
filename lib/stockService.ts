import axios from "axios"
import { redis } from "./redis"

// Types for our stock data
export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  marketCap?: number
  volume?: number
  industry?: string
  pe?: number
  dividendYield?: number
  beta?: number
  eps?: number
  exchange: "BIST" | "NYSE" | "NASDAQ" | "OTHER"
  currency?: string
  open?: number
  high?: number
  low?: number
  previousClose?: number
}

export interface StockHistoricalData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface StockFilters {
  exchange?: string
  industry?: string
  marketCap?: string
  volume?: [number, number]
  priceRange?: [number, number]
}

// Cache TTL in seconds
const CACHE_TTL = {
  SEARCH: 60 * 5, // 5 minutes
  DETAILS: 60 * 2, // 2 minutes
  HISTORICAL: 60 * 60, // 1 hour
  TOP_STOCKS: 60 * 15, // 15 minutes
}

class StockService {
  private apiKey: string
  private bistStocks: Record<string, any>

  constructor() {
    // Get API key from environment variable
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || "demo"

    // Initialize BIST stocks data (since Alpha Vantage has limited coverage)
    this.bistStocks = this.initializeBistStocks()
  }

  // Search for stocks across exchanges
  async searchStocks(query: string, exchange?: string): Promise<StockData[]> {
    if (!query) return []

    const cacheKey = `search:${query}:${exchange || "all"}`

    // Try to get from cache first
    const cachedResult = await redis.get(cacheKey)
    if (cachedResult) {
      return JSON.parse(cachedResult)
    }

    try {
      // For BIST stocks, use our predefined list
      if (exchange === "BIST") {
        const results = Object.values(this.bistStocks)
          .filter(
            (stock) =>
              stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
              stock.name.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 10)
          .map((stock) => ({
            symbol: stock.symbol,
            name: stock.name,
            price: stock.price,
            change: stock.change,
            changePercent: stock.changePercent,
            exchange: "BIST" as const,
          }))

        await redis.set(cacheKey, JSON.stringify(results), { ex: CACHE_TTL.SEARCH })
        return results
      }

      // For other exchanges, use Alpha Vantage
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: "SYMBOL_SEARCH",
          keywords: query,
          apikey: this.apiKey,
        },
      })

      if (response.data.Note) {
        console.warn("Alpha Vantage API limit reached:", response.data.Note)
        throw new Error("API rate limit reached")
      }

      if (!response.data.bestMatches) {
        return []
      }

      const results = response.data.bestMatches
        .filter((match: any) => !exchange || match["4. region"].includes(exchange))
        .slice(0, 10)
        .map((match: any) => ({
          symbol: match["1. symbol"],
          name: match["2. name"],
          exchange: this.mapExchange(match["4. region"]),
          price: 0, // We'll need to fetch this separately
          change: 0,
          changePercent: 0,
        }))

      // Fetch current prices for each result
      const resultsWithPrices = await Promise.all(
        results.map(async (stock: StockData) => {
          try {
            const details = await this.getStockDetails(stock.symbol)
            return {
              ...stock,
              price: details.price,
              change: details.change,
              changePercent: details.changePercent,
            }
          } catch (error) {
            return stock
          }
        }),
      )

      await redis.set(cacheKey, JSON.stringify(resultsWithPrices), { ex: CACHE_TTL.SEARCH })
      return resultsWithPrices
    } catch (error) {
      console.error("Error searching stocks:", error)

      // If API fails, return empty array
      return []
    }
  }

  // Get detailed stock information
  async getStockDetails(symbol: string): Promise<StockData> {
    const cacheKey = `stock:${symbol}`

    // Try to get from cache first
    const cachedResult = await redis.get(cacheKey)
    if (cachedResult) {
      return JSON.parse(cachedResult)
    }

    try {
      // For BIST stocks, use our predefined data
      if (this.bistStocks[symbol]) {
        const stock = this.bistStocks[symbol]
        await redis.set(cacheKey, JSON.stringify(stock), { ex: CACHE_TTL.DETAILS })
        return stock
      }

      // For other stocks, use Alpha Vantage
      const quoteResponse = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: "GLOBAL_QUOTE",
          symbol: symbol,
          apikey: this.apiKey,
        },
      })

      if (quoteResponse.data.Note) {
        console.warn("Alpha Vantage API limit reached:", quoteResponse.data.Note)
        throw new Error("API rate limit reached")
      }

      const quote = quoteResponse.data["Global Quote"]

      if (!quote || !quote["01. symbol"]) {
        throw new Error("Stock not found")
      }

      // Get company overview for additional details
      const overviewResponse = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: "OVERVIEW",
          symbol: symbol,
          apikey: this.apiKey,
        },
      })

      const overview = overviewResponse.data

      const stock: StockData = {
        symbol: quote["01. symbol"],
        name: overview.Name || symbol,
        price: Number.parseFloat(quote["05. price"]),
        change: Number.parseFloat(quote["09. change"]),
        changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
        open: Number.parseFloat(quote["02. open"]),
        high: Number.parseFloat(quote["03. high"]),
        low: Number.parseFloat(quote["04. low"]),
        previousClose: Number.parseFloat(quote["08. previous close"]),
        volume: Number.parseInt(quote["06. volume"]),
        marketCap: overview.MarketCapitalization ? Number.parseInt(overview.MarketCapitalization) : undefined,
        pe: overview.PERatio ? Number.parseFloat(overview.PERatio) : undefined,
        eps: overview.EPS ? Number.parseFloat(overview.EPS) : undefined,
        dividendYield: overview.DividendYield ? Number.parseFloat(overview.DividendYield) : undefined,
        industry: overview.Industry,
        exchange: this.mapExchange(overview.Exchange),
        currency: overview.Currency,
      }

      await redis.set(cacheKey, JSON.stringify(stock), { ex: CACHE_TTL.DETAILS })
      return stock
    } catch (error) {
      console.error(`Error fetching stock details for ${symbol}:`, error)

      // If API fails, throw error
      throw new Error(`Failed to fetch details for ${symbol}`)
    }
  }

  // Get historical data for a stock
  async getHistoricalData(symbol: string, interval = "daily", outputsize = "compact"): Promise<StockHistoricalData[]> {
    const cacheKey = `historical:${symbol}:${interval}:${outputsize}`

    // Try to get from cache first
    const cachedResult = await redis.get(cacheKey)
    if (cachedResult) {
      return JSON.parse(cachedResult)
    }

    try {
      // For BIST stocks, generate mock historical data
      if (this.bistStocks[symbol]) {
        const data = this.generateMockHistoricalData(symbol)
        await redis.set(cacheKey, JSON.stringify(data), { ex: CACHE_TTL.HISTORICAL })
        return data
      }

      // Map interval to Alpha Vantage function
      const functionMap: Record<string, string> = {
        daily: "TIME_SERIES_DAILY",
        weekly: "TIME_SERIES_WEEKLY",
        monthly: "TIME_SERIES_MONTHLY",
      }

      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: functionMap[interval] || "TIME_SERIES_DAILY",
          symbol: symbol,
          outputsize: outputsize,
          apikey: this.apiKey,
        },
      })

      if (response.data.Note) {
        console.warn("Alpha Vantage API limit reached:", response.data.Note)
        throw new Error("API rate limit reached")
      }

      // Extract the time series data
      const timeSeriesKey = Object.keys(response.data).find((key) => key.includes("Time Series"))

      if (!timeSeriesKey || !response.data[timeSeriesKey]) {
        throw new Error("Historical data not available")
      }

      const timeSeries = response.data[timeSeriesKey]

      // Convert to our format
      const historicalData: StockHistoricalData[] = Object.entries(timeSeries)
        .map(([date, values]: [string, any]) => ({
          date,
          open: Number.parseFloat(values["1. open"]),
          high: Number.parseFloat(values["2. high"]),
          low: Number.parseFloat(values["3. low"]),
          close: Number.parseFloat(values["4. close"]),
          volume: Number.parseInt(values["5. volume"]),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      await redis.set(cacheKey, JSON.stringify(historicalData), { ex: CACHE_TTL.HISTORICAL })
      return historicalData
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error)

      // If API fails, return empty array
      return []
    }
  }

  // Get top stocks by market cap
  async getTopStocks(exchange = "NYSE", limit = 10): Promise<StockData[]> {
    const cacheKey = `top:${exchange}:${limit}`

    // Try to get from cache first
    const cachedResult = await redis.get(cacheKey)
    if (cachedResult) {
      return JSON.parse(cachedResult)
    }

    try {
      if (exchange === "BIST") {
        // For BIST, use our predefined list
        const topBistStocks = Object.values(this.bistStocks)
          .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
          .slice(0, limit)

        await redis.set(cacheKey, JSON.stringify(topBistStocks), { ex: CACHE_TTL.TOP_STOCKS })
        return topBistStocks
      } else {
        // For US markets, use a predefined list of top stocks
        // Alpha Vantage doesn't have a direct "top stocks" endpoint
        const topUSSymbols = [
          "AAPL",
          "MSFT",
          "GOOGL",
          "AMZN",
          "META",
          "TSLA",
          "BRK-B",
          "NVDA",
          "JPM",
          "JNJ",
          "V",
          "PG",
          "UNH",
          "HD",
          "MA",
          "BAC",
          "XOM",
          "DIS",
          "CSCO",
          "VZ",
        ]

        const stockPromises = topUSSymbols
          .slice(0, limit)
          .map((symbol) => this.getStockDetails(symbol).catch(() => null))

        const stocks = (await Promise.all(stockPromises)).filter(Boolean) as StockData[]

        await redis.set(cacheKey, JSON.stringify(stocks), { ex: CACHE_TTL.TOP_STOCKS })
        return stocks
      }
    } catch (error) {
      console.error("Error fetching top stocks:", error)
      return []
    }
  }

  // Filter stocks based on criteria
  async filterStocks(filters: StockFilters): Promise<StockData[]> {
    const filterKey = JSON.stringify(filters)
    const cacheKey = `filter:${filterKey}`

    // Try to get from cache first
    const cachedResult = await redis.get(cacheKey)
    if (cachedResult) {
      return JSON.parse(cachedResult)
    }

    try {
      let stocks: StockData[] = []

      if (filters.exchange === "BIST") {
        stocks = Object.values(this.bistStocks)
      } else {
        // For US markets, use our top stocks as a base
        stocks = await this.getTopStocks(filters.exchange, 20)
      }

      // Apply filters
      const filteredStocks = stocks.filter((stock) => {
        // Filter by industry
        if (filters.industry && filters.industry !== "All" && stock.industry !== filters.industry) {
          return false
        }

        // Filter by market cap
        if (filters.marketCap && filters.marketCap !== "all" && stock.marketCap) {
          const marketCapInBillions = stock.marketCap / 1e9
          if (
            (filters.marketCap === "micro" && (marketCapInBillions < 0.05 || marketCapInBillions >= 0.3)) ||
            (filters.marketCap === "small" && (marketCapInBillions < 0.3 || marketCapInBillions >= 2)) ||
            (filters.marketCap === "mid" && (marketCapInBillions < 2 || marketCapInBillions >= 10)) ||
            (filters.marketCap === "large" && (marketCapInBillions < 10 || marketCapInBillions >= 200)) ||
            (filters.marketCap === "mega" && marketCapInBillions < 200)
          ) {
            return false
          }
        }

        // Filter by volume
        if (filters.volume && stock.volume) {
          const volumeInMillions = stock.volume / 1e6
          if (volumeInMillions < filters.volume[0] || volumeInMillions > filters.volume[1]) {
            return false
          }
        }

        // Filter by price range
        if (filters.priceRange && (stock.price < filters.priceRange[0] || stock.price > filters.priceRange[1])) {
          return false
        }

        return true
      })

      await redis.set(cacheKey, JSON.stringify(filteredStocks), { ex: CACHE_TTL.SEARCH })
      return filteredStocks
    } catch (error) {
      console.error("Error filtering stocks:", error)
      return []
    }
  }

  // Helper method to map exchange names
  private mapExchange(exchange: string): "BIST" | "NYSE" | "NASDAQ" | "OTHER" {
    if (exchange.includes("BIST") || exchange.includes("Istanbul")) {
      return "BIST"
    } else if (exchange.includes("NYSE")) {
      return "NYSE"
    } else if (exchange.includes("NASDAQ")) {
      return "NASDAQ"
    } else {
      return "OTHER"
    }
  }

  // Initialize BIST stocks data
  private initializeBistStocks(): Record<string, StockData> {
    return {
      THYAO: {
        symbol: "THYAO",
        name: "Türk Hava Yolları",
        price: 245.6,
        change: 3.2,
        changePercent: 1.32,
        marketCap: 338000000000,
        volume: 15000000,
        industry: "Transportation",
        pe: 5.8,
        dividendYield: 0,
        beta: 1.2,
        eps: 42.34,
        exchange: "BIST",
        currency: "TRY",
        open: 242.4,
        high: 246.8,
        low: 241.5,
        previousClose: 242.4,
      },
      GARAN: {
        symbol: "GARAN",
        name: "Garanti Bankası",
        price: 36.42,
        change: 0.42,
        changePercent: 1.17,
        marketCap: 152964000000,
        volume: 25000000,
        industry: "Finance",
        pe: 3.5,
        dividendYield: 2.5,
        beta: 0.9,
        eps: 10.41,
        exchange: "BIST",
        currency: "TRY",
        open: 36.0,
        high: 36.58,
        low: 35.92,
        previousClose: 36.0,
      },
      ASELS: {
        symbol: "ASELS",
        name: "Aselsan",
        price: 33.78,
        change: -0.22,
        changePercent: -0.65,
        marketCap: 76005000000,
        volume: 8000000,
        industry: "Defense",
        pe: 6.2,
        dividendYield: 1.8,
        beta: 0.85,
        eps: 5.45,
        exchange: "BIST",
        currency: "TRY",
        open: 34.0,
        high: 34.12,
        low: 33.65,
        previousClose: 34.0,
      },
      KCHOL: {
        symbol: "KCHOL",
        name: "Koç Holding",
        price: 93.15,
        change: 1.15,
        changePercent: 1.25,
        marketCap: 236000000000,
        volume: 12000000,
        industry: "Holding",
        pe: 7.8,
        dividendYield: 3.2,
        beta: 0.95,
        eps: 11.94,
        exchange: "BIST",
        currency: "TRY",
        open: 92.0,
        high: 93.45,
        low: 91.85,
        previousClose: 92.0,
      },
      EREGL: {
        symbol: "EREGL",
        name: "Ereğli Demir Çelik",
        price: 28.64,
        change: 0.34,
        changePercent: 1.2,
        marketCap: 100240000000,
        volume: 18000000,
        industry: "Steel",
        pe: 4.2,
        dividendYield: 5.1,
        beta: 1.1,
        eps: 6.82,
        exchange: "BIST",
        currency: "TRY",
        open: 28.3,
        high: 28.76,
        low: 28.22,
        previousClose: 28.3,
      },
      AKBNK: {
        symbol: "AKBNK",
        name: "Akbank",
        price: 25.76,
        change: 0.26,
        changePercent: 1.02,
        marketCap: 133952000000,
        volume: 22000000,
        industry: "Finance",
        pe: 3.8,
        dividendYield: 2.2,
        beta: 0.88,
        eps: 6.78,
        exchange: "BIST",
        currency: "TRY",
        open: 25.5,
        high: 25.88,
        low: 25.42,
        previousClose: 25.5,
      },
      TUPRS: {
        symbol: "TUPRS",
        name: "Tüpraş",
        price: 145.3,
        change: 2.3,
        changePercent: 1.61,
        marketCap: 36325000000,
        volume: 5000000,
        industry: "Energy",
        pe: 8.4,
        dividendYield: 4.5,
        beta: 1.05,
        eps: 17.3,
        exchange: "BIST",
        currency: "TRY",
        open: 143.0,
        high: 145.8,
        low: 142.7,
        previousClose: 143.0,
      },
      BIMAS: {
        symbol: "BIMAS",
        name: "BİM Mağazalar",
        price: 124.5,
        change: -1.5,
        changePercent: -1.19,
        marketCap: 75585000000,
        volume: 4000000,
        industry: "Retail",
        pe: 18.2,
        dividendYield: 1.2,
        beta: 0.65,
        eps: 6.84,
        exchange: "BIST",
        currency: "TRY",
        open: 126.0,
        high: 126.4,
        low: 124.2,
        previousClose: 126.0,
      },
      SISE: {
        symbol: "SISE",
        name: "Şişecam",
        price: 16.92,
        change: 0.12,
        changePercent: 0.71,
        marketCap: 38070000000,
        volume: 15000000,
        industry: "Manufacturing",
        pe: 5.6,
        dividendYield: 3.8,
        beta: 0.92,
        eps: 3.02,
        exchange: "BIST",
        currency: "TRY",
        open: 16.8,
        high: 17.05,
        low: 16.75,
        previousClose: 16.8,
      },
      YKBNK: {
        symbol: "YKBNK",
        name: "Yapı Kredi Bankası",
        price: 12.84,
        change: 0.14,
        changePercent: 1.1,
        marketCap: 108500000000,
        volume: 20000000,
        industry: "Finance",
        pe: 3.2,
        dividendYield: 1.8,
        beta: 0.95,
        eps: 4.01,
        exchange: "BIST",
        currency: "TRY",
        open: 12.7,
        high: 12.92,
        low: 12.68,
        previousClose: 12.7,
      },
    }
  }

  // Generate mock historical data for BIST stocks
  private generateMockHistoricalData(symbol: string): StockHistoricalData[] {
    const stock = this.bistStocks[symbol]
    if (!stock) return []

    const data: StockHistoricalData[] = []
    const basePrice = stock.price
    const volatility = 0.02 // 2% daily volatility

    // Generate 30 days of data
    const today = new Date()

    for (let i = 30; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue

      const dailyChange = (Math.random() - 0.5) * volatility * 2
      const dayPrice = basePrice * (1 + (dailyChange - i * 0.001)) // Slight trend based on day

      const open = dayPrice * (1 - Math.random() * 0.01)
      const close = dayPrice
      const high = Math.max(open, close) * (1 + Math.random() * 0.01)
      const low = Math.min(open, close) * (1 - Math.random() * 0.01)
      const volume = Math.floor(stock.volume * (0.7 + Math.random() * 0.6))

      data.push({
        date: date.toISOString().split("T")[0],
        open: Number.parseFloat(open.toFixed(2)),
        high: Number.parseFloat(high.toFixed(2)),
        low: Number.parseFloat(low.toFixed(2)),
        close: Number.parseFloat(close.toFixed(2)),
        volume,
      })
    }

    return data
  }
}

export const stockService = new StockService()
