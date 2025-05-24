import { Container } from "../di/Container"
import type { StockService } from "../../application/services/StockService"
import type { NewsService } from "../../application/services/NewsService"
import type { ICacheService } from "../../domain/services/ICacheService"

export class LiveDataUpdater {
  private stockService: StockService
  private newsService: NewsService
  private cache: ICacheService
  private isRunning = false
  private intervals: NodeJS.Timeout[] = []

  constructor() {
    const container = Container.getInstance()
    this.stockService = container.get<StockService>("stockService")
    this.newsService = container.get<NewsService>("newsService")
    this.cache = container.get<ICacheService>("cache")
  }

  start(): void {
    if (this.isRunning) return

    this.isRunning = true
    console.log("Starting live data updater...")

    // Update top stocks every 1 minute
    this.intervals.push(setInterval(() => this.updateTopStocks(), 60 * 1000))

    // Update news every 5 minutes
    this.intervals.push(setInterval(() => this.updateNews(), 5 * 60 * 1000))

    // Update BIST stocks every 30 seconds (during market hours)
    this.intervals.push(setInterval(() => this.updateBistStocks(), 30 * 1000))

    // Update NYSE/NASDAQ stocks every 15 seconds (during market hours)
    this.intervals.push(setInterval(() => this.updateUSStocks(), 15 * 1000))

    // Initial updates
    this.updateTopStocks()
    this.updateNews()
    this.updateBistStocks()
    this.updateUSStocks()
  }

  stop(): void {
    if (!this.isRunning) return

    this.isRunning = false
    console.log("Stopping live data updater...")

    this.intervals.forEach((interval) => clearInterval(interval))
    this.intervals = []
  }

  private async updateTopStocks(): Promise<void> {
    try {
      const exchanges = ["NYSE", "NASDAQ", "BIST"]

      for (const exchange of exchanges) {
        try {
          await this.stockService.getTopStocks(exchange, 20)
          console.log(`Updated top stocks for ${exchange}`)
        } catch (error) {
          console.error(`Failed to update top stocks for ${exchange}:`, error)
        }
      }
    } catch (error) {
      console.error("Error updating top stocks:", error)
    }
  }

  private async updateNews(): Promise<void> {
    try {
      await this.newsService.refreshNews()
      console.log("Updated general news")

      // Update news for popular stocks
      const popularStocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "THYAO", "GARAN", "ASELS"]

      for (const symbol of popularStocks) {
        try {
          await this.newsService.refreshStockNews(symbol)
        } catch (error) {
          console.error(`Failed to update news for ${symbol}:`, error)
        }
      }

      console.log("Updated stock-specific news")
    } catch (error) {
      console.error("Error updating news:", error)
    }
  }

  private async updateBistStocks(): Promise<void> {
    if (!this.isBistMarketOpen()) return

    try {
      await this.stockService.refreshAllStockData("BIST")
      console.log("Updated BIST stocks")
    } catch (error) {
      console.error("Error updating BIST stocks:", error)
    }
  }

  private async updateUSStocks(): Promise<void> {
    if (!this.isUSMarketOpen()) return

    try {
      // Update NYSE stocks
      await this.stockService.refreshAllStockData("NYSE")
      console.log("Updated NYSE stocks")

      // Update NASDAQ stocks
      await this.stockService.refreshAllStockData("NASDAQ")
      console.log("Updated NASDAQ stocks")
    } catch (error) {
      console.error("Error updating US stocks:", error)
    }
  }

  private isBistMarketOpen(): boolean {
    const now = new Date()
    const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Istanbul" }))
    const hour = istTime.getHours()
    const day = istTime.getDay()

    // BIST is open Monday-Friday, 10:00-18:00 IST
    return day >= 1 && day <= 5 && hour >= 10 && hour < 18
  }

  private isUSMarketOpen(): boolean {
    const now = new Date()
    const etTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
    const hour = etTime.getHours()
    const day = etTime.getDay()

    // US markets are open Monday-Friday, 9:30-16:00 ET
    return day >= 1 && day <= 5 && ((hour === 9 && etTime.getMinutes() >= 30) || (hour >= 10 && hour < 16))
  }
}

// Singleton instance
export const liveDataUpdater = new LiveDataUpdater()
