import { supabase } from "./supabase"

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

export interface WatchlistWithItems extends Watchlist {
  items: WatchlistItem[]
  itemCount: number
}

export class WatchlistService {
  static async getUserWatchlists(userId: string): Promise<WatchlistWithItems[]> {
    const { data: watchlists, error } = await supabase
      .from("watchlists")
      .select(`
        *,
        watchlist_items (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw new Error(`Failed to fetch watchlists: ${error.message}`)

    return (watchlists || []).map((watchlist) => ({
      ...watchlist,
      items: watchlist.watchlist_items || [],
      itemCount: (watchlist.watchlist_items || []).length,
    }))
  }

  static async createWatchlist(
    userId: string,
    name: string,
    description?: string,
    isPublic = false,
  ): Promise<Watchlist> {
    const { data, error } = await supabase
      .from("watchlists")
      .insert({
        user_id: userId,
        name,
        description,
        is_public: isPublic,
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create watchlist: ${error.message}`)
    return data
  }

  static async updateWatchlist(
    watchlistId: string,
    updates: Partial<Pick<Watchlist, "name" | "description" | "is_public">>,
  ): Promise<Watchlist> {
    const { data, error } = await supabase
      .from("watchlists")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", watchlistId)
      .select()
      .single()

    if (error) throw new Error(`Failed to update watchlist: ${error.message}`)
    return data
  }

  static async deleteWatchlist(watchlistId: string): Promise<void> {
    const { error } = await supabase.from("watchlists").delete().eq("id", watchlistId)

    if (error) throw new Error(`Failed to delete watchlist: ${error.message}`)
  }

  static async addStockToWatchlist(watchlistId: string, symbol: string, exchange: string): Promise<WatchlistItem> {
    const { data, error } = await supabase
      .from("watchlist_items")
      .insert({
        watchlist_id: watchlistId,
        symbol: symbol.toUpperCase(),
        exchange,
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        throw new Error("Stock is already in this watchlist")
      }
      throw new Error(`Failed to add stock to watchlist: ${error.message}`)
    }

    return data
  }

  static async removeStockFromWatchlist(watchlistId: string, symbol: string, exchange: string): Promise<void> {
    const { error } = await supabase
      .from("watchlist_items")
      .delete()
      .eq("watchlist_id", watchlistId)
      .eq("symbol", symbol.toUpperCase())
      .eq("exchange", exchange)

    if (error) throw new Error(`Failed to remove stock from watchlist: ${error.message}`)
  }

  static async getWatchlistItems(watchlistId: string): Promise<WatchlistItem[]> {
    const { data, error } = await supabase
      .from("watchlist_items")
      .select("*")
      .eq("watchlist_id", watchlistId)
      .order("added_at", { ascending: false })

    if (error) throw new Error(`Failed to fetch watchlist items: ${error.message}`)
    return data || []
  }

  static async isStockInWatchlist(watchlistId: string, symbol: string, exchange: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("watchlist_items")
      .select("id")
      .eq("watchlist_id", watchlistId)
      .eq("symbol", symbol.toUpperCase())
      .eq("exchange", exchange)
      .single()

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to check watchlist: ${error.message}`)
    }

    return !!data
  }

  static async getPublicWatchlists(limit = 20): Promise<WatchlistWithItems[]> {
    const { data: watchlists, error } = await supabase
      .from("watchlists")
      .select(`
        *,
        watchlist_items (*)
      `)
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw new Error(`Failed to fetch public watchlists: ${error.message}`)

    return (watchlists || []).map((watchlist) => ({
      ...watchlist,
      items: watchlist.watchlist_items || [],
      itemCount: (watchlist.watchlist_items || []).length,
    }))
  }
}
