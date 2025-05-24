import { stockService, type StockData } from "./stock-service"

export interface ScreenerFilters {
  exchange?: "BIST" | "NYSE" | "NASDAQ" | "ALL"
  marketCapMin?: number
  marketCapMax?: number
  peRatioMin?: number
  peRatioMax?: number
  dividendYieldMin?: number
  dividendYieldMax?: number
  priceMin?: number
  priceMax?: number
  volumeMin?: number
  changePercentMin?: number
  changePercentMax?: number
  sector?: string
  industry?: string
  betaMin?: number
  betaMax?: number
  rsiMin?: number
  rsiMax?: number
  sortBy?: "marketCap" | "price" | "changePercent" | "volume" | "pe" | "dividendYield"
  sortOrder?: "asc" | "desc"
  limit?: number
}

export interface ScreenerResult {
  stocks: StockData[]
  totalCount: number
  filters: ScreenerFilters
}

export class MarketScreener {
  private static readonly POPULAR_STOCKS = {
    NYSE: ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NVDA", "JPM", "JNJ", "V", "PG", "UNH", "HD", "MA", "DIS"],
    NASDAQ: [
      "AAPL",
      "MSFT",
      "GOOGL",
      "AMZN",
      "META",
      "TSLA",
      "NVDA",
      "NFLX",
      "ADBE",
      "CRM",
      "INTC",
      "CSCO",
      "PEP",
      "AVGO",
      "TXN",
    ],
    BIST: ["THYAO", "GARAN", "ASELS", "KCHOL", "TUPRS", "ISCTR", "AKBNK", "SISE", "PETKM", "BIMAS"],
  }

  static async screenStocks(filters: ScreenerFilters): Promise<ScreenerResult> {
    try {
      // Get stocks based on exchange filter
      const stocksToScreen = await this.getStocksForScreening(filters.exchange)

      // Apply filters
      let filteredStocks = stocksToScreen.filter((stock) => this.applyFilters(stock, filters))

      // Sort results
      if (filters.sortBy) {
        filteredStocks = this.sortStocks(filteredStocks, filters.sortBy, filters.sortOrder || "desc")
      }

      // Apply limit
      const limit = filters.limit || 50
      const limitedStocks = filteredStocks.slice(0, limit)

      return {
        stocks: limitedStocks,
        totalCount: filteredStocks.length,
        filters,
      }
    } catch (error) {
      console.error("Error screening stocks:", error)
      return {
        stocks: [],
        totalCount: 0,
        filters,
      }
    }
  }

  private static async getStocksForScreening(exchange?: string): Promise<StockData[]> {
    const allStocks: StockData[] = []

    if (!exchange || exchange === "ALL") {
      // Get stocks from all exchanges
      const exchanges: Array<"NYSE" | "NASDAQ" | "BIST"> = ["NYSE", "NASDAQ", "BIST"]

      for (const ex of exchanges) {
        const symbols = this.POPULAR_STOCKS[ex]
        const stockPromises = symbols.map(async (symbol) => {
          try {
            return await stockService.getStockDetails(symbol, ex)
          } catch (error) {
            console.error(`Error fetching ${symbol}:`, error)
            return null
          }
        })

        const stocks = (await Promise.all(stockPromises)).filter(Boolean) as StockData[]
        allStocks.push(...stocks)
      }
    } else {
      // Get stocks from specific exchange
      const symbols = this.POPULAR_STOCKS[exchange as keyof typeof this.POPULAR_STOCKS] || []
      const stockPromises = symbols.map(async (symbol) => {
        try {
          return await stockService.getStockDetails(symbol, exchange)
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error)
          return null
        }
      })

      const stocks = (await Promise.all(stockPromises)).filter(Boolean) as StockData[]
      allStocks.push(...stocks)
    }

    return allStocks
  }

  private static applyFilters(stock: StockData, filters: ScreenerFilters): boolean {
    // Exchange filter
    if (filters.exchange && filters.exchange !== "ALL" && stock.exchange !== filters.exchange) {
      return false
    }

    // Market cap filters
    if (filters.marketCapMin && (!stock.marketCap || stock.marketCap < filters.marketCapMin)) {
      return false
    }
    if (filters.marketCapMax && (!stock.marketCap || stock.marketCap > filters.marketCapMax)) {
      return false
    }

    // P/E ratio filters
    if (filters.peRatioMin && (!stock.pe || stock.pe < filters.peRatioMin)) {
      return false
    }
    if (filters.peRatioMax && (!stock.pe || stock.pe > filters.peRatioMax)) {
      return false
    }

    // Dividend yield filters
    if (filters.dividendYieldMin && (!stock.dividendYield || stock.dividendYield < filters.dividendYieldMin)) {
      return false
    }
    if (filters.dividendYieldMax && (!stock.dividendYield || stock.dividendYield > filters.dividendYieldMax)) {
      return false
    }

    // Price filters
    if (filters.priceMin && stock.price < filters.priceMin) {
      return false
    }
    if (filters.priceMax && stock.price > filters.priceMax) {
      return false
    }

    // Volume filters
    if (filters.volumeMin && (!stock.volume || stock.volume < filters.volumeMin)) {
      return false
    }

    // Change percent filters
    if (filters.changePercentMin && stock.changePercent < filters.changePercentMin) {
      return false
    }
    if (filters.changePercentMax && stock.changePercent > filters.changePercentMax) {
      return false
    }

    // Sector filter
    if (filters.sector && stock.industry !== filters.sector) {
      return false
    }

    // Beta filters
    if (filters.betaMin && (!stock.beta || stock.beta < filters.betaMin)) {
      return false
    }
    if (filters.betaMax && (!stock.beta || stock.beta > filters.betaMax)) {
      return false
    }

    return true
  }

  private static sortStocks(stocks: StockData[], sortBy: string, sortOrder: "asc" | "desc"): StockData[] {
    return stocks.sort((a, b) => {
      let aValue: number
      let bValue: number

      switch (sortBy) {
        case "marketCap":
          aValue = a.marketCap || 0
          bValue = b.marketCap || 0
          break
        case "price":
          aValue = a.price
          bValue = b.price
          break
        case "changePercent":
          aValue = a.changePercent
          bValue = b.changePercent
          break
        case "volume":
          aValue = a.volume || 0
          bValue = b.volume || 0
          break
        case "pe":
          aValue = a.pe || 0
          bValue = b.pe || 0
          break
        case "dividendYield":
          aValue = a.dividendYield || 0
          bValue = b.dividendYield || 0
          break
        default:
          return 0
      }

      if (sortOrder === "asc") {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })
  }

  static getPresetScreens(): Record<string, ScreenerFilters> {
    return {
      "Top Gainers": {
        changePercentMin: 5,
        sortBy: "changePercent",
        sortOrder: "desc",
        limit: 20,
      },
      "Top Losers": {
        changePercentMax: -5,
        sortBy: "changePercent",
        sortOrder: "asc",
        limit: 20,
      },
      "High Volume": {
        volumeMin: 1000000,
        sortBy: "volume",
        sortOrder: "desc",
        limit: 20,
      },
      "Large Cap": {
        marketCapMin: 10000000000, // 10B+
        sortBy: "marketCap",
        sortOrder: "desc",
        limit: 20,
      },
      "Mid Cap": {
        marketCapMin: 2000000000, // 2B+
        marketCapMax: 10000000000, // 10B
        sortBy: "marketCap",
        sortOrder: "desc",
        limit: 20,
      },
      "Small Cap": {
        marketCapMin: 300000000, // 300M+
        marketCapMax: 2000000000, // 2B
        sortBy: "marketCap",
        sortOrder: "desc",
        limit: 20,
      },
      "High Dividend": {
        dividendYieldMin: 3,
        sortBy: "dividendYield",
        sortOrder: "desc",
        limit: 20,
      },
      "Low P/E": {
        peRatioMin: 1,
        peRatioMax: 15,
        sortBy: "pe",
        sortOrder: "asc",
        limit: 20,
      },
      "BIST Stars": {
        exchange: "BIST",
        sortBy: "marketCap",
        sortOrder: "desc",
        limit: 20,
      },
      "Tech Giants": {
        industry: "Technology",
        marketCapMin: 50000000000, // 50B+
        sortBy: "marketCap",
        sortOrder: "desc",
        limit: 20,
      },
    }
  }
}
