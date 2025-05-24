import { RedisCache } from "../cache/RedisCache"
import { SupabaseUserRepository } from "../repositories/SupabaseUserRepository"
import { SupabaseStockRepository } from "../repositories/SupabaseStockRepository"
import { SupabaseNewsRepository } from "../repositories/SupabaseNewsRepository"
import { SupabaseWatchlistRepository } from "../repositories/SupabaseWatchlistRepository"
import { SupabasePortfolioRepository } from "../repositories/SupabasePortfolioRepository"
import { AlphaVantageStockService } from "../services/AlphaVantageStockService"
import { AlphaVantageNewsService } from "../services/AlphaVantageNewsService"
import { StockService } from "../../application/services/StockService"
import { NewsService } from "../../application/services/NewsService"
import { UserService } from "../../application/services/UserService"
import { WatchlistService } from "../../application/services/WatchlistService"
import { PortfolioService } from "../../application/services/PortfolioService"

export class Container {
  private static instance: Container
  private services: Map<string, any> = new Map()

  private constructor() {
    this.initializeServices()
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container()
    }
    return Container.instance
  }

  private initializeServices(): void {
    // Infrastructure services
    const cache = new RedisCache()
    this.services.set("cache", cache)

    // Repositories
    const userRepository = new SupabaseUserRepository()
    const stockRepository = new SupabaseStockRepository()
    const newsRepository = new SupabaseNewsRepository()
    const watchlistRepository = new SupabaseWatchlistRepository()
    const portfolioRepository = new SupabasePortfolioRepository()

    this.services.set("userRepository", userRepository)
    this.services.set("stockRepository", stockRepository)
    this.services.set("newsRepository", newsRepository)
    this.services.set("watchlistRepository", watchlistRepository)
    this.services.set("portfolioRepository", portfolioRepository)

    // External data services
    const stockDataService = new AlphaVantageStockService(cache, stockRepository)
    const newsDataService = new AlphaVantageNewsService(cache, newsRepository, stockRepository)

    this.services.set("stockDataService", stockDataService)
    this.services.set("newsDataService", newsDataService)

    // Application services
    const stockService = new StockService(stockRepository, stockDataService, cache)
    const newsService = new NewsService(newsRepository, newsDataService, cache)
    const userService = new UserService(userRepository, cache)
    const watchlistService = new WatchlistService(watchlistRepository, stockRepository, cache)
    const portfolioService = new PortfolioService(portfolioRepository, stockRepository, cache)

    this.services.set("stockService", stockService)
    this.services.set("newsService", newsService)
    this.services.set("userService", userService)
    this.services.set("watchlistService", watchlistService)
    this.services.set("portfolioService", portfolioService)
  }

  get<T>(serviceName: string): T {
    const service = this.services.get(serviceName)
    if (!service) {
      throw new Error(`Service ${serviceName} not found`)
    }
    return service
  }
}
