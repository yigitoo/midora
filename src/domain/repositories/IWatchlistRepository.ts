import type { Watchlist, WatchlistItem, WatchlistWithStocks } from "../entities/Watchlist"

export interface IWatchlistRepository {
  findById(id: string): Promise<Watchlist | null>
  findByUserId(userId: string): Promise<Watchlist[]>
  create(watchlistData: Omit<Watchlist, "id" | "createdAt" | "updatedAt">): Promise<Watchlist>
  update(id: string, watchlistData: Partial<Watchlist>): Promise<Watchlist>
  delete(id: string): Promise<void>

  // Item methods
  addStock(watchlistId: string, stockId: string): Promise<WatchlistItem>
  removeStock(watchlistId: string, stockId: string): Promise<void>
  getWatchlistWithStocks(watchlistId: string): Promise<WatchlistWithStocks | null>
  isStockInWatchlist(watchlistId: string, stockId: string): Promise<boolean>
}
