import {
  SupabaseWatchlistRepository,
  type Watchlist,
  type WatchlistItem,
} from "@/src/infrastructure/repositories/SupabaseWatchlistRepository"

export class WatchlistService {
  private repository: SupabaseWatchlistRepository

  constructor() {
    this.repository = new SupabaseWatchlistRepository()
  }

  async getUserWatchlists(userId: string): Promise<Watchlist[]> {
    return await this.repository.getUserWatchlists(userId)
  }

  async getWatchlistWithItems(watchlistId: string): Promise<{ watchlist: Watchlist; items: WatchlistItem[] } | null> {
    try {
      const items = await this.repository.getWatchlistItems(watchlistId)
      // Note: You'd need to implement getWatchlistById in the repository
      return { watchlist: {} as Watchlist, items }
    } catch (error) {
      console.error("Error fetching watchlist:", error)
      return null
    }
  }

  async createWatchlist(userId: string, name: string, description?: string, isPublic = false): Promise<Watchlist> {
    return await this.repository.createWatchlist({
      user_id: userId,
      name,
      description,
      is_public: isPublic,
    })
  }

  async addStockToWatchlist(watchlistId: string, symbol: string, exchange: string): Promise<WatchlistItem> {
    return await this.repository.addToWatchlist({
      watchlist_id: watchlistId,
      symbol,
      exchange,
    })
  }

  async removeStockFromWatchlist(watchlistId: string, symbol: string, exchange: string): Promise<void> {
    return await this.repository.removeFromWatchlist(watchlistId, symbol, exchange)
  }

  async deleteWatchlist(watchlistId: string): Promise<void> {
    return await this.repository.deleteWatchlist(watchlistId)
  }

  async getWatchlistItems(watchlistId: string): Promise<WatchlistItem[]> {
    return await this.repository.getWatchlistItems(watchlistId)
  }
}
