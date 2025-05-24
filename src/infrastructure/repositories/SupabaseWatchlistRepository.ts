import { createClient } from "@supabase/supabase-js"

export interface Watchlist {
  id: string
  user_id: string
  name: string
  description?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface WatchlistItem {
  id: string
  watchlist_id: string
  symbol: string
  exchange: string
  added_at: string
}

export class SupabaseWatchlistRepository {
  private supabase

  constructor() {
    this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }

  async getUserWatchlists(userId: string): Promise<Watchlist[]> {
    const { data, error } = await this.supabase
      .from("watchlists")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async getWatchlistItems(watchlistId: string): Promise<WatchlistItem[]> {
    const { data, error } = await this.supabase
      .from("watchlist_items")
      .select("*")
      .eq("watchlist_id", watchlistId)
      .order("added_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async createWatchlist(watchlist: Omit<Watchlist, "id" | "created_at" | "updated_at">): Promise<Watchlist> {
    const { data, error } = await this.supabase.from("watchlists").insert(watchlist).select().single()

    if (error) throw error
    return data
  }

  async addToWatchlist(item: Omit<WatchlistItem, "id" | "added_at">): Promise<WatchlistItem> {
    const { data, error } = await this.supabase.from("watchlist_items").insert(item).select().single()

    if (error) throw error
    return data
  }

  async removeFromWatchlist(watchlistId: string, symbol: string, exchange: string): Promise<void> {
    const { error } = await this.supabase
      .from("watchlist_items")
      .delete()
      .eq("watchlist_id", watchlistId)
      .eq("symbol", symbol)
      .eq("exchange", exchange)

    if (error) throw error
  }

  async deleteWatchlist(watchlistId: string): Promise<void> {
    const { error } = await this.supabase.from("watchlists").delete().eq("id", watchlistId)

    if (error) throw error
  }
}
