import type { NewsArticle, StockNews, NewsSearchResult } from "../entities/News"

export interface INewsRepository {
  findById(id: string): Promise<NewsArticle | null>
  search(query?: string, category?: string, limit?: number, offset?: number): Promise<NewsSearchResult>
  getLatestNews(limit?: number): Promise<NewsArticle[]>
  getStockNews(stockId: string, limit?: number): Promise<NewsArticle[]>
  create(articleData: Omit<NewsArticle, "id" | "createdAt" | "updatedAt">): Promise<NewsArticle>
  update(id: string, articleData: Partial<NewsArticle>): Promise<NewsArticle>

  // Stock news relationships
  linkStockToNews(stockId: string, newsId: string, relevanceScore?: number): Promise<StockNews>
  unlinkStockFromNews(stockId: string, newsId: string): Promise<void>
}
