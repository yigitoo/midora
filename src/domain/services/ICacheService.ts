export interface ICacheService {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>
  delete(key: string): Promise<void>
  deletePattern(pattern: string): Promise<void>
  exists(key: string): Promise<boolean>

  // Specialized cache methods
  getStockQuote(symbol: string, exchange: string): Promise<any | null>
  setStockQuote(symbol: string, exchange: string, quote: any, ttlSeconds?: number): Promise<void>

  getNews(category: string, page: number): Promise<any[] | null>
  setNews(category: string, page: number, news: any[], ttlSeconds?: number): Promise<void>

  getStockNews(symbol: string, page: number): Promise<any[] | null>
  setStockNews(symbol: string, page: number, news: any[], ttlSeconds?: number): Promise<void>
}
