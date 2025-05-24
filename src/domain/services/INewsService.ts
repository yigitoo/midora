import type { NewsArticle } from "../entities/News"

export interface INewsService {
  getGeneralNews(limit?: number): Promise<NewsArticle[]>
  getStockNews(symbol: string, limit?: number): Promise<NewsArticle[]>
  searchNews(query: string, limit?: number): Promise<NewsArticle[]>
  refreshNews(): Promise<void>
  refreshStockNews(symbol: string): Promise<void>
}
