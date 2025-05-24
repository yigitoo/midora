import { createClient } from "@supabase/supabase-js"

export interface NewsArticle {
  id: string
  title: string
  content: string
  source: string
  published_at: string
  stock_symbols: string[]
  sentiment: "positive" | "negative" | "neutral"
  created_at: string
  updated_at: string
}

export class SupabaseNewsRepository {
  private supabase

  constructor() {
    this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }

  async getLatestNews(limit = 20): Promise<NewsArticle[]> {
    const { data, error } = await this.supabase
      .from("news_articles")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  async getNewsBySymbol(symbol: string, limit = 10): Promise<NewsArticle[]> {
    const { data, error } = await this.supabase
      .from("news_articles")
      .select("*")
      .contains("stock_symbols", [symbol])
      .order("published_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  async createNewsArticle(article: Omit<NewsArticle, "id" | "created_at" | "updated_at">): Promise<NewsArticle> {
    const { data, error } = await this.supabase.from("news_articles").insert(article).select().single()

    if (error) throw error
    return data
  }
}
