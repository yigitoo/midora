export interface NewsArticle {
  id: string
  title: string
  summary?: string
  content?: string
  url?: string
  source?: string
  author?: string
  publishedAt?: Date
  sentiment?: "positive" | "negative" | "neutral"
  relevanceScore?: number
  imageUrl?: string
  category?: string
  createdAt: Date
  updatedAt: Date
}

export interface StockNews {
  id: string
  stockId: string
  newsArticleId: string
  relevanceScore?: number
  createdAt: Date
}

export interface NewsSearchResult {
  articles: NewsArticle[]
  totalCount: number
  hasMore: boolean
}
