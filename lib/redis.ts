import { Redis } from 'ioredis'

if (!process.env.REDIS_URL) {
  process.env.REDIS_URL = 'redis://localhost:6379'
}

const redis = new Redis(process.env.REDIS_URL)

redis.on('error', (error) => {
  console.error('Redis connection error:', error)
})

redis.on('connect', () => {
  console.log('Connected to Redis successfully')
})

export { redis }
