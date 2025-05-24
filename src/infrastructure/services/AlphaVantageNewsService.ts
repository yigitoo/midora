import axios from "axios"
import type { INewsService } from "../../domain/services/INewsService"
import type { ICacheService } from "../../domain/services/ICacheService"
import type { INewsRepository } from "../../domain/repositories/INewsRepository"
import type { IStockRepository } from "../../domain/repositories/IStockRepository"
import type { NewsArticle } from "../../domain/entities/News"

export class AlphaVantageNewsService implements INewsService {
  private apiKey: string
  private baseUrl = "https://www.alphavantage.co/query"
  private cache: ICacheService
  private newsRepository: INewsRepository
  private stockRepository: IStockRepository

  constructor(cache: ICacheService, newsRepository: INewsRepository, stockRepository: IStockRepository) {
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || "demo"
    this.cache = cache
    this.newsRepository = newsRepository
    this.stockRepository = stockRepository
  }

  async getGeneralNews(limit = 20): Promise<NewsArticle[]> {
    const cacheKey = "news:general"

    // Try cache first
    const cached = await this.cache.getNews("general", 1)
    if (cached) return cached.slice(0, limit)

    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: "NEWS_SENTIMENT",
          topics: "financial_markets",
          limit: 50,
          apikey: this.apiKey,
        },
      })

      if (response.data.Note) {
        console.warn("Alpha Vantage API limit reached")
        return await this.newsRepository.getLatestNews(limit)
      }

      const feed = response.data.feed || []
      const articles: NewsArticle[] = []

      for (const item of feed.slice(0, limit)) {
        try {
          // Check if article already exists
          const existingArticle = await this.newsRepository.findById(item.url)
          if (existingArticle) {
            articles.push(existingArticle)
            continue
          }

          const article = await this.newsRepository.create({
            title: item.title,
            summary: item.summary,
            url: item.url,
            source: item.source,
            author: item.authors?.join(", "),
            publishedAt: new Date(item.time_published),
            sentiment: this.mapSentiment(item.overall_sentiment_label),
            relevanceScore: Number.parseFloat(item.overall_sentiment_score),
            imageUrl: item.banner_image,
            category: "financial_markets",
          })

          articles.push(article)
        } catch (error) {
          console.error("Error creating news article:", error)
        }
      }

      // Cache for 15 minutes
      await this.cache.setNews("general", 1, articles, 900)
      return articles
    } catch (error) {
      console.error("Error fetching general news:", error)
      return await this.newsRepository.getLatestNews(limit)
    }
  }

  async getStockNews(symbol: string, limit = 10): Promise<NewsArticle[]> {
    const cacheKey = `news:stock:${symbol}`

    // Try cache first
    const cached = await this.cache.getStockNews(symbol, 1)
    if (cached) return cached.slice(0, limit)

    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: "NEWS_SENTIMENT",
          tickers: symbol,
          limit: 50,
          apikey: this.apiKey,
        },
      })

      if (response.data.Note) {
        console.warn("Alpha Vantage API limit reached")
        return await this.newsRepository.getStockNews(symbol, limit)
      }

      const feed = response.data.feed || []
      const articles: NewsArticle[] = []

      // Find the stock in our database
      const stock = await this.stockRepository.findBySymbol(symbol)
      if (!stock) return []

      for (const item of feed.slice(0, limit)) {
        try {
          // Check if article already exists
          let article = await this.newsRepository.findById(item.url)

          if (!article) {
            article = await this.newsRepository.create({
              title: item.title,
              summary: item.summary,
              url: item.url,
              source: item.source,
              author: item.authors?.join(", "),
              publishedAt: new Date(item.time_published),
              sentiment: this.mapSentiment(item.overall_sentiment_label),
              relevanceScore: Number.parseFloat(item.overall_sentiment_score),
              imageUrl: item.banner_image,
              category: "stock_specific",
            })
          }

          // Link article to stock
          const tickerSentiment = item.ticker_sentiment?.find((t: any) => t.ticker === symbol)
          const relevanceScore = tickerSentiment ? Number.parseFloat(tickerSentiment.relevance_score) : 0.5

          try {
            await this.newsRepository.linkStockToNews(stock.id, article.id, relevanceScore)
          } catch (error) {
            // Link might already exist, ignore error
          }

          articles.push(article)
        } catch (error) {
          console.error("Error processing stock news article:", error)
        }
      }

      // Cache for 10 minutes
      await this.cache.setStockNews(symbol, 1, articles, 600)
      return articles
    } catch (error) {
      console.error(`Error fetching news for ${symbol}:`, error)
      return await this.newsRepository.getStockNews(symbol, limit)
    }
  }

  async searchNews(query: string, limit = 20): Promise<NewsArticle[]> {
    const cacheKey = `news:search:${query}`

    // Try cache first
    const cached = await this.cache.get<NewsArticle[]>(cacheKey)
    if (cached) return cached.slice(0, limit)

    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: "NEWS_SENTIMENT",
          keywords: query,
          limit: 50,
          apikey: this.apiKey,
        },
      })

      if (response.data.Note) {
        console.warn("Alpha Vantage API limit reached")
        const searchResult = await this.newsRepository.search(query, undefined, limit)
        return searchResult.articles
      }

      const feed = response.data.feed || []
      const articles: NewsArticle[] = []

      for (const item of feed.slice(0, limit)) {
        try {
          // Check if article already exists
          let article = await this.newsRepository.findById(item.url)

          if (!article) {
            article = await this.newsRepository.create({
              title: item.title,
              summary: item.summary,
              url: item.url,
              source: item.source,
              author: item.authors?.join(", "),
              publishedAt: new Date(item.time_published),
              sentiment: this.mapSentiment(item.overall_sentiment_label),
              relevanceScore: Number.parseFloat(item.overall_sentiment_score),
              imageUrl: item.banner_image,
              category: "search_result",
            })
          }

          articles.push(article)
        } catch (error) {
          console.error("Error processing search news article:", error)
        }
      }

      // Cache for 10 minutes
      await this.cache.set(cacheKey, articles, 600)
      return articles
    } catch (error) {
      console.error(`Error searching news for "${query}":`, error)
      const searchResult = await this.newsRepository.search(query, undefined, limit)
      return searchResult.articles
    }
  }

  async refreshNews(): Promise<void> {
    // Clear general news cache and fetch fresh data
    await this.cache.delete("news:general")
    await this.getGeneralNews()
  }

  async refreshStockNews(symbol: string): Promise<void> {
    // Clear stock news cache and fetch fresh data
    await this.cache.deletePattern(`news:stock:${symbol}*`)
    await this.getStockNews(symbol)
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
}
