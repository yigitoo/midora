import type { INewsRepository } from "../../domain/repositories/INewsRepository"
import type { INewsService } from "../../domain/services/INewsService"
import type { ICacheService } from "../../domain/services/ICacheService"
import type { NewsArticle } from "../../domain/entities/News"

export class NewsService {
  constructor(
    private newsRepository: INewsRepository,
    private newsDataService: INewsService,
    private cache: ICacheService,
  ) {}

  async getLatestNews(limit = 20): Promise<NewsArticle[]> {
    try {
      const cacheKey = "latest_news"

      // Try cache first
      const cached = await this.cache.get<NewsArticle[]>(cacheKey)
      if (cached) return cached.slice(0, limit)

      // Get from external service
      const articles = await this.newsDataService.getGeneralNews(limit)

      // Cache for 10 minutes
      await this.cache.set(cacheKey, articles, 600)

      return articles
    } catch (error) {
      console.error("Error getting latest news:", error)
      throw new Error("Failed to get latest news")
    }
  }

  async getStockNews(symbol: string, limit = 10): Promise<NewsArticle[]> {
    try {
      const cacheKey = `stock_news:${symbol}`

      // Try cache first
      const cached = await this.cache.getStockNews(symbol, 1)
      if (cached) return cached.slice(0, limit)

      // Get from external service
      const articles = await this.newsDataService.getStockNews(symbol, limit)

      // Cache for 5 minutes
      await this.cache.setStockNews(symbol, 1, articles, 300)

      return articles
    } catch (error) {
      console.error(`Error getting news for ${symbol}:`, error)
      throw new Error("Failed to get stock news")
    }
  }

  async searchNews(query: string, category?: string, limit = 20): Promise<NewsArticle[]> {
    try {
      if (!query.trim()) {
        return await this.getLatestNews(limit)
      }

      const cacheKey = `news_search:${query}:${category || "all"}`

      // Try cache first
      const cached = await this.cache.get<NewsArticle[]>(cacheKey)
      if (cached) return cached.slice(0, limit)

      // Search in database first
      const dbResult = await this.newsRepository.search(query, category, limit)

      if (dbResult.articles.length >= 5) {
        await this.cache.set(cacheKey, dbResult.articles, 300)
        return dbResult.articles
      }

      // If not enough results, search external service
      const apiArticles = await this.newsDataService.searchNews(query, limit)

      // Cache for 5 minutes
      await this.cache.set(cacheKey, apiArticles, 300)

      return apiArticles
    } catch (error) {
      console.error(`Error searching news for "${query}":`, error)
      throw new Error("Failed to search news")
    }
  }

  async refreshNews(): Promise<void> {
    try {
      // Clear cache
      await this.cache.deletePattern("latest_news*")
      await this.cache.deletePattern("news_search*")

      // Refresh from external service
      await this.newsDataService.refreshNews()
    } catch (error) {
      console.error("Error refreshing news:", error)
      throw new Error("Failed to refresh news")
    }
  }

  async refreshStockNews(symbol: string): Promise<void> {
    try {
      // Clear cache for this stock
      await this.cache.deletePattern(`stock_news:${symbol}*`)

      // Refresh from external service
      await this.newsDataService.refreshStockNews(symbol)
    } catch (error) {
      console.error(`Error refreshing news for ${symbol}:`, error)
      throw new Error("Failed to refresh stock news")
    }
  }
}
