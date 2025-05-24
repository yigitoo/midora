import Redis from "ioredis"
import type { ICacheService } from "../../domain/services/ICacheService"

export class RedisCache implements ICacheService {
  private redis: Redis

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })

    this.redis.on("error", (error) => {
      console.error("Redis connection error:", error)
    })

    this.redis.on("connect", () => {
      console.log("Redis connected successfully")
    })
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error(`Redis GET error for key ${key}:`, error)
      return null
    }
  }

  async set<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
    try {
      await this.redis.setex(key, ttlSeconds, JSON.stringify(value))
    } catch (error) {
      console.error(`Redis SET error for key ${key}:`, error)
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key)
    } catch (error) {
      console.error(`Redis DELETE error for key ${key}:`, error)
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } catch (error) {
      console.error(`Redis DELETE PATTERN error for pattern ${pattern}:`, error)
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key)
      return result === 1
    } catch (error) {
      console.error(`Redis EXISTS error for key ${key}:`, error)
      return false
    }
  }

  // Specialized cache methods for stock data
  async getStockQuote(symbol: string, exchange: string): Promise<any | null> {
    const key = `stock:quote:${exchange}:${symbol}`
    return this.get(key)
  }

  async setStockQuote(symbol: string, exchange: string, quote: any, ttlSeconds = 60): Promise<void> {
    const key = `stock:quote:${exchange}:${symbol}`
    await this.set(key, quote, ttlSeconds)
  }

  async getNews(category: string, page: number): Promise<any[] | null> {
    const key = `news:${category}:page:${page}`
    return this.get(key)
  }

  async setNews(category: string, page: number, news: any[], ttlSeconds = 300): Promise<void> {
    const key = `news:${category}:page:${page}`
    await this.set(key, news, ttlSeconds)
  }

  async getStockNews(symbol: string, page: number): Promise<any[] | null> {
    const key = `news:stock:${symbol}:page:${page}`
    return this.get(key)
  }

  async setStockNews(symbol: string, page: number, news: any[], ttlSeconds = 300): Promise<void> {
    const key = `news:stock:${symbol}:page:${page}`
    await this.set(key, news, ttlSeconds)
  }

  // Bulk operations for live data
  async setMultipleStockQuotes(quotes: Record<string, any>, ttlSeconds = 60): Promise<void> {
    try {
      const pipeline = this.redis.pipeline()

      Object.entries(quotes).forEach(([key, quote]) => {
        pipeline.setex(key, ttlSeconds, JSON.stringify(quote))
      })

      await pipeline.exec()
    } catch (error) {
      console.error("Redis bulk SET error:", error)
    }
  }

  async getMultipleStockQuotes(keys: string[]): Promise<Record<string, any>> {
    try {
      const pipeline = this.redis.pipeline()
      keys.forEach((key) => pipeline.get(key))

      const results = await pipeline.exec()
      const quotes: Record<string, any> = {}

      results?.forEach((result, index) => {
        if (result && result[1]) {
          try {
            quotes[keys[index]] = JSON.parse(result[1] as string)
          } catch (error) {
            console.error(`Error parsing cached quote for ${keys[index]}:`, error)
          }
        }
      })

      return quotes
    } catch (error) {
      console.error("Redis bulk GET error:", error)
      return {}
    }
  }
}
