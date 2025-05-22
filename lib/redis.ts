// Optional Redis client that falls back to in-memory cache if Redis is not available
import { Redis } from "ioredis"

// Simple in-memory cache as fallback
class MemoryCache {
  private cache: Map<string, any> = new Map()

  async get(key: string) {
    return this.cache.get(key)
  }

  async set(key: string, value: any, options?: { ex?: number }) {
    this.cache.set(key, value)
    if (options?.ex) {
      setTimeout(() => {
        this.cache.delete(key)
      }, options.ex * 1000)
    }
    return "OK"
  }

  async del(key: string) {
    return this.cache.delete(key) ? 1 : 0
  }

  on(event: string, callback: Function) {
    // No-op for memory cache
    if (event === "connect") {
      callback()
    }
  }
}

// Try to connect to Redis, fall back to memory cache if not available
let redisClient: Redis | MemoryCache

try {
  if (process.env.REDIS_URL) {
    redisClient = new Redis(process.env.REDIS_URL)
    redisClient.on("error", (error) => {
      console.warn("Redis connection error, falling back to memory cache:", error.message)
      redisClient = new MemoryCache()
    })

    redisClient.on("connect", () => {
      console.log("Connected to Redis successfully")
    })
  } else {
    console.log("No REDIS_URL provided, using in-memory cache")
    redisClient = new MemoryCache()
  }
} catch (error) {
  console.warn("Failed to initialize Redis, using in-memory cache:", error)
  redisClient = new MemoryCache()
}

export const redis = redisClient
