import { getRedis } from "./redis"

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
  exchange: "BIST" | "NYSE" | "NASDAQ"
  currency?: string
  open?: number
  high?: number
  low?: number
  previousClose?: number
  fiftyTwoWeekHigh?: number
  fiftyTwoWeekLow?: number
  avgVolume?: number
  bookValue?: number
  priceToBook?: number
  ebitda?: number
  revenuePerShare?: number
  profitMargin?: number
  operatingMargin?: number
  returnOnAssets?: number
  returnOnEquity?: number
  quarterlyEarningsGrowth?: number
  quarterlyRevenueGrowth?: number
  analystTargetPrice?: number
  trailingPE?: number
  forwardPE?: number
  pegRatio?: number
  priceToSales?: number
  priceToBook2?: number
  enterpriseValue?: number
  forwardAnnualDividendRate?: number
  forwardAnnualDividendYield?: number
  payoutRatio?: number
  dividendDate?: string
  exDividendDate?: string
  lastSplitFactor?: string
  lastSplitDate?: string
}

export interface StockHistoricalData {
  date: string
  price: number
  open: number
  high: number
  low: number
  volume: number
}

export interface NewsArticle {
  title: string
  summary: string
  url: string
  source: string
  publishedAt: string
  sentiment: "positive" | "negative" | "neutral"
  relevanceScore: number
  imageUrl?: string
}

class StockService {
  private apiKey: string
  private bistStocks: Record<string, any>
  private redis: any

  constructor() {
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || "demo"
    this.bistStocks = this.initializeBistStocks()
    try {
      this.redis = getRedis()
    } catch (error) {
      console.warn("Redis not available, using memory cache")
      this.redis = null
    }
  }

  private async getFromCache(key: string): Promise<any> {
    if (!this.redis) return null
    try {
      const value = await this.redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error("Redis GET error:", error)
      return null
    }
  }

  private async setCache(key: string, value: any, ttl = 300): Promise<void> {
    if (!this.redis) return
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error("Redis SET error:", error)
    }
  }

  async searchStocks(query: string, exchange?: string): Promise<StockData[]> {
    if (!query) return []

    const cacheKey = `search:${query}:${exchange || "all"}`
    const cached = await this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      // For BIST stocks, use our predefined list
      if (exchange === "BIST") {
        const results = Object.values(this.bistStocks)
          .filter(
            (stock: any) =>
              stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
              stock.name.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 10)
          .map((stock: any) => ({
            ...stock,
            exchange: "BIST" as const,
          }))

        await this.setCache(cacheKey, results, 300)
        return results
      }

      // For other exchanges, use Alpha Vantage
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${this.apiKey}`,
      )
      const data = await response.json()

      if (data.Note) {
        console.warn("Alpha Vantage API limit reached")
        return []
      }

      if (!data.bestMatches) {
        return []
      }

      const results = data.bestMatches
        .filter((match: any) => !exchange || match["4. region"].includes(exchange))
        .slice(0, 10)
        .map((match: any) => ({
          symbol: match["1. symbol"],
          name: match["2. name"],
          exchange: this.mapExchange(match["4. region"]),
          price: 0,
          change: 0,
          changePercent: 0,
        }))

      // Fetch current prices for each result
      const resultsWithPrices = await Promise.all(
        results.map(async (stock: StockData) => {
          try {
            const details = await this.getStockDetails(stock.symbol, stock.exchange)
            return details || stock
          } catch (error) {
            return stock
          }
        }),
      )

      await this.setCache(cacheKey, resultsWithPrices, 300)
      return resultsWithPrices
    } catch (error) {
      console.error("Error searching stocks:", error)
      return []
    }
  }

  async getStockDetails(symbol: string, exchange?: string): Promise<StockData | null> {
    const cacheKey = `stock:${symbol}:${exchange || "default"}`
    const cached = await this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      // For BIST stocks, use our predefined data
      if (exchange === "BIST" || this.bistStocks[symbol]) {
        const stock = this.bistStocks[symbol]
        if (!stock) return null

        const result = {
          ...stock,
          exchange: "BIST" as const,
        }

        await this.setCache(cacheKey, result, 120)
        return result
      }

      // For other stocks, use Alpha Vantage
      const [quoteResponse, overviewResponse] = await Promise.all([
        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`),
        fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${this.apiKey}`),
      ])

      const quoteData = await quoteResponse.json()
      const overviewData = await overviewResponse.json()

      if (quoteData.Note || overviewData.Note) {
        console.warn("Alpha Vantage API limit reached")
        return null
      }

      const quote = quoteData["Global Quote"]
      if (!quote || !quote["01. symbol"]) {
        return null
      }

      const stock: StockData = {
        symbol: quote["01. symbol"],
        name: overviewData.Name || symbol,
        price: Number.parseFloat(quote["05. price"]),
        change: Number.parseFloat(quote["09. change"]),
        changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
        open: Number.parseFloat(quote["02. open"]),
        high: Number.parseFloat(quote["03. high"]),
        low: Number.parseFloat(quote["04. low"]),
        previousClose: Number.parseFloat(quote["08. previous close"]),
        volume: Number.parseInt(quote["06. volume"]),
        marketCap: overviewData.MarketCapitalization ? Number.parseInt(overviewData.MarketCapitalization) : undefined,
        pe: overviewData.PERatio ? Number.parseFloat(overviewData.PERatio) : undefined,
        eps: overviewData.EPS ? Number.parseFloat(overviewData.EPS) : undefined,
        dividendYield: overviewData.DividendYield ? Number.parseFloat(overviewData.DividendYield) : undefined,
        industry: overviewData.Industry,
        exchange: this.mapExchange(overviewData.Exchange) || "NYSE",
        currency: "USD",
        fiftyTwoWeekHigh: overviewData["52WeekHigh"] ? Number.parseFloat(overviewData["52WeekHigh"]) : undefined,
        fiftyTwoWeekLow: overviewData["52WeekLow"] ? Number.parseFloat(overviewData["52WeekLow"]) : undefined,
        beta: overviewData.Beta ? Number.parseFloat(overviewData.Beta) : undefined,
        bookValue: overviewData.BookValue ? Number.parseFloat(overviewData.BookValue) : undefined,
        priceToBook: overviewData.PriceToBookRatio ? Number.parseFloat(overviewData.PriceToBookRatio) : undefined,
        ebitda: overviewData.EBITDA ? Number.parseInt(overviewData.EBITDA) : undefined,
        revenuePerShare: overviewData.RevenuePerShareTTM
          ? Number.parseFloat(overviewData.RevenuePerShareTTM)
          : undefined,
        profitMargin: overviewData.ProfitMargin ? Number.parseFloat(overviewData.ProfitMargin) : undefined,
        operatingMargin: overviewData.OperatingMarginTTM
          ? Number.parseFloat(overviewData.OperatingMarginTTM)
          : undefined,
        returnOnAssets: overviewData.ReturnOnAssetsTTM ? Number.parseFloat(overviewData.ReturnOnAssetsTTM) : undefined,
        returnOnEquity: overviewData.ReturnOnEquityTTM ? Number.parseFloat(overviewData.ReturnOnEquityTTM) : undefined,
        quarterlyEarningsGrowth: overviewData.QuarterlyEarningsGrowthYOY
          ? Number.parseFloat(overviewData.QuarterlyEarningsGrowthYOY)
          : undefined,
        quarterlyRevenueGrowth: overviewData.QuarterlyRevenueGrowthYOY
          ? Number.parseFloat(overviewData.QuarterlyRevenueGrowthYOY)
          : undefined,
        analystTargetPrice: overviewData.AnalystTargetPrice
          ? Number.parseFloat(overviewData.AnalystTargetPrice)
          : undefined,
        trailingPE: overviewData.TrailingPE ? Number.parseFloat(overviewData.TrailingPE) : undefined,
        forwardPE: overviewData.ForwardPE ? Number.parseFloat(overviewData.ForwardPE) : undefined,
        pegRatio: overviewData.PEGRatio ? Number.parseFloat(overviewData.PEGRatio) : undefined,
        priceToSales: overviewData.PriceToSalesRatioTTM
          ? Number.parseFloat(overviewData.PriceToSalesRatioTTM)
          : undefined,
        enterpriseValue: overviewData.EnterpriseValue ? Number.parseInt(overviewData.EnterpriseValue) : undefined,
        forwardAnnualDividendRate: overviewData.ForwardAnnualDividendRate
          ? Number.parseFloat(overviewData.ForwardAnnualDividendRate)
          : undefined,
        forwardAnnualDividendYield: overviewData.ForwardAnnualDividendYield
          ? Number.parseFloat(overviewData.ForwardAnnualDividendYield)
          : undefined,
        payoutRatio: overviewData.PayoutRatio ? Number.parseFloat(overviewData.PayoutRatio) : undefined,
        dividendDate: overviewData.DividendDate,
        exDividendDate: overviewData.ExDividendDate,
        lastSplitFactor: overviewData.LastSplitFactor,
        lastSplitDate: overviewData.LastSplitDate,
      }

      await this.setCache(cacheKey, stock, 120)
      return stock
    } catch (error) {
      console.error(`Error fetching stock details for ${symbol}:`, error)
      return null
    }
  }

  async getHistoricalData(symbol: string, interval = "daily", outputsize = "compact"): Promise<StockHistoricalData[]> {
    const cacheKey = `historical:${symbol}:${interval}:${outputsize}`
    const cached = await this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      // For BIST stocks, generate mock historical data
      if (this.bistStocks[symbol]) {
        const data = this.generateMockHistoricalData(symbol)
        await this.setCache(cacheKey, data, 3600)
        return data
      }

      const functionMap: Record<string, string> = {
        daily: "TIME_SERIES_DAILY",
        weekly: "TIME_SERIES_WEEKLY",
        monthly: "TIME_SERIES_MONTHLY",
      }

      const response = await fetch(
        `https://www.alphavantage.co/query?function=${functionMap[interval] || "TIME_SERIES_DAILY"}&symbol=${symbol}&outputsize=${outputsize}&apikey=${this.apiKey}`,
      )
      const data = await response.json()

      if (data.Note) {
        console.warn("Alpha Vantage API limit reached")
        return []
      }

      const timeSeriesKey = Object.keys(data).find((key) => key.includes("Time Series"))
      if (!timeSeriesKey || !data[timeSeriesKey]) {
        return []
      }

      const timeSeries = data[timeSeriesKey]
      const historicalData: StockHistoricalData[] = Object.entries(timeSeries)
        .map(([date, values]: [string, any]) => ({
          date,
          open: Number.parseFloat(values["1. open"]),
          high: Number.parseFloat(values["2. high"]),
          low: Number.parseFloat(values["3. low"]),
          price: Number.parseFloat(values["4. close"]),
          volume: Number.parseInt(values["5. volume"]),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      await this.setCache(cacheKey, historicalData, 3600)
      return historicalData
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error)
      return []
    }
  }

  async getTopStocks(exchange = "NYSE", limit = 10): Promise<StockData[]> {
    const cacheKey = `top:${exchange}:${limit}`
    const cached = await this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      if (exchange === "BIST") {
        const topBistStocks = Object.values(this.bistStocks)
          .sort((a: any, b: any) => (b.marketCap || 0) - (a.marketCap || 0))
          .slice(0, limit)

        await this.setCache(cacheKey, topBistStocks, 900)
        return topBistStocks
      } else {
        // For US markets, use a predefined list of top stocks
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

        await this.setCache(cacheKey, stocks, 900)
        return stocks
      }
    } catch (error) {
      console.error("Error fetching top stocks:", error)
      return []
    }
  }

  async getStockNews(symbol: string, limit = 10): Promise<NewsArticle[]> {
    const cacheKey = `news:${symbol}:${limit}`
    const cached = await this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&limit=${limit}&apikey=${this.apiKey}`,
      )
      const data = await response.json()

      if (data.Note) {
        console.warn("Alpha Vantage API limit reached")
        return []
      }

      const feed = data.feed || []
      const news = feed.map((item: any) => ({
        title: item.title,
        summary: item.summary,
        url: item.url,
        source: item.source,
        publishedAt: item.time_published,
        sentiment: this.mapSentiment(item.overall_sentiment_label),
        relevanceScore: Number.parseFloat(item.overall_sentiment_score),
        imageUrl: item.banner_image,
      }))

      await this.setCache(cacheKey, news, 300)
      return news
    } catch (error) {
      console.error(`Error fetching news for ${symbol}:`, error)
      return []
    }
  }

  private mapExchange(exchange: string): "BIST" | "NYSE" | "NASDAQ" {
    if (exchange?.includes("BIST") || exchange?.includes("Istanbul")) {
      return "BIST"
    } else if (exchange?.includes("NYSE")) {
      return "NYSE"
    } else {
      return "NASDAQ"
    }
  }

  private mapSentiment(sentimentLabel: string): "positive" | "negative" | "neutral" {
    switch (sentimentLabel?.toLowerCase()) {
      case "bullish":
      case "somewhat-bullish":
        return "positive"
      case "bearish":
      case "somewhat-bearish":
        return "negative"
      default:
        return "neutral"
    }
  }

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
        fiftyTwoWeekHigh: 280.5,
        fiftyTwoWeekLow: 180.2,
        avgVolume: 12000000,
        bookValue: 85.6,
        priceToBook: 2.87,
        ebitda: 15000000000,
        profitMargin: 0.12,
        operatingMargin: 0.15,
        returnOnAssets: 0.08,
        returnOnEquity: 0.18,
        quarterlyEarningsGrowth: 0.25,
        quarterlyRevenueGrowth: 0.18,
        analystTargetPrice: 275.0,
        trailingPE: 5.8,
        forwardPE: 5.2,
        pegRatio: 0.8,
        priceToSales: 1.2,
        enterpriseValue: 350000000000,
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
        fiftyTwoWeekHigh: 42.5,
        fiftyTwoWeekLow: 28.8,
        avgVolume: 22000000,
        bookValue: 28.5,
        priceToBook: 1.28,
        ebitda: 25000000000,
        profitMargin: 0.22,
        operatingMargin: 0.35,
        returnOnAssets: 0.12,
        returnOnEquity: 0.15,
        quarterlyEarningsGrowth: 0.15,
        quarterlyRevenueGrowth: 0.12,
        analystTargetPrice: 40.0,
        trailingPE: 3.5,
        forwardPE: 3.2,
        pegRatio: 0.6,
        priceToSales: 2.8,
        enterpriseValue: 160000000000,
        forwardAnnualDividendRate: 0.9,
        forwardAnnualDividendYield: 2.5,
        payoutRatio: 0.35,
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
        fiftyTwoWeekHigh: 38.5,
        fiftyTwoWeekLow: 25.2,
        avgVolume: 7500000,
        bookValue: 22.8,
        priceToBook: 1.48,
        ebitda: 8500000000,
        profitMargin: 0.18,
        operatingMargin: 0.22,
        returnOnAssets: 0.1,
        returnOnEquity: 0.16,
        quarterlyEarningsGrowth: 0.2,
        quarterlyRevenueGrowth: 0.15,
        analystTargetPrice: 37.5,
        trailingPE: 6.2,
        forwardPE: 5.8,
        pegRatio: 0.9,
        priceToSales: 3.2,
        enterpriseValue: 78000000000,
        forwardAnnualDividendRate: 0.6,
        forwardAnnualDividendYield: 1.8,
        payoutRatio: 0.25,
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
        fiftyTwoWeekHigh: 105.8,
        fiftyTwoWeekLow: 75.2,
        avgVolume: 10500000,
        bookValue: 65.2,
        priceToBook: 1.43,
        ebitda: 35000000000,
        profitMargin: 0.15,
        operatingMargin: 0.18,
        returnOnAssets: 0.09,
        returnOnEquity: 0.14,
        quarterlyEarningsGrowth: 0.18,
        quarterlyRevenueGrowth: 0.14,
        analystTargetPrice: 98.5,
        trailingPE: 7.8,
        forwardPE: 7.2,
        pegRatio: 1.1,
        priceToSales: 1.8,
        enterpriseValue: 245000000000,
        forwardAnnualDividendRate: 3.0,
        forwardAnnualDividendYield: 3.2,
        payoutRatio: 0.4,
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
        fiftyTwoWeekHigh: 165.5,
        fiftyTwoWeekLow: 125.8,
        avgVolume: 4500000,
        bookValue: 95.2,
        priceToBook: 1.53,
        ebitda: 12000000000,
        profitMargin: 0.2,
        operatingMargin: 0.25,
        returnOnAssets: 0.11,
        returnOnEquity: 0.18,
        quarterlyEarningsGrowth: 0.22,
        quarterlyRevenueGrowth: 0.16,
        analystTargetPrice: 155.0,
        trailingPE: 8.4,
        forwardPE: 7.8,
        pegRatio: 1.0,
        priceToSales: 2.1,
        enterpriseValue: 38000000000,
        forwardAnnualDividendRate: 6.5,
        forwardAnnualDividendYield: 4.5,
        payoutRatio: 0.45,
      },
    }
  }

  private generateMockHistoricalData(symbol: string): StockHistoricalData[] {
    const stock = this.bistStocks[symbol]
    if (!stock) return []

    const data: StockHistoricalData[] = []
    const basePrice = stock.price
    const volatility = 0.02

    const today = new Date()
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)

      if (date.getDay() === 0 || date.getDay() === 6) continue

      const dailyChange = (Math.random() - 0.5) * volatility * 2
      const dayPrice = basePrice * (1 + (dailyChange - i * 0.001))

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
        price: Number.parseFloat(close.toFixed(2)),
        volume,
      })
    }

    return data
  }
}

export const stockService = new StockService()
