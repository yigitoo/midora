import { supabase } from "../database/supabase"
import type { IStockRepository } from "../../domain/repositories/IStockRepository"
import type { Stock, StockPrice, StockQuote, StockSearchResult } from "../../domain/entities/Stock"

export class SupabaseStockRepository implements IStockRepository {
  async findById(id: string): Promise<Stock | null> {
    const { data, error } = await supabase.from("stocks").select("*").eq("id", id).single()

    if (error || !data) return null

    return this.mapToStock(data)
  }

  async findBySymbol(symbol: string, exchange?: string): Promise<Stock | null> {
    let query = supabase.from("stocks").select("*").eq("symbol", symbol.toUpperCase())

    if (exchange) {
      query = query.eq("exchange", exchange)
    }

    const { data, error } = await query.single()

    if (error || !data) return null

    return this.mapToStock(data)
  }

  async search(query: string, exchange?: string, limit = 20, offset = 0): Promise<StockSearchResult> {
    let dbQuery = supabase
      .from("stocks")
      .select("*", { count: "exact" })
      .eq("is_active", true)
      .or(`symbol.ilike.%${query}%,name.ilike.%${query}%`)

    if (exchange) {
      dbQuery = dbQuery.eq("exchange", exchange)
    }

    const { data, error, count } = await dbQuery
      .range(offset, offset + limit - 1)
      .order("market_cap", { ascending: false, nullsLast: true })

    if (error) throw new Error(`Failed to search stocks: ${error.message}`)

    return {
      stocks: data?.map(this.mapToStock) || [],
      totalCount: count || 0,
      hasMore: (count || 0) > offset + limit,
    }
  }

  async create(stockData: Omit<Stock, "id" | "createdAt" | "updatedAt">): Promise<Stock> {
    const { data, error } = await supabase
      .from("stocks")
      .insert({
        symbol: stockData.symbol.toUpperCase(),
        name: stockData.name,
        exchange: stockData.exchange,
        sector: stockData.sector,
        industry: stockData.industry,
        market_cap: stockData.marketCap,
        currency: stockData.currency,
        is_active: stockData.isActive,
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create stock: ${error.message}`)

    return this.mapToStock(data)
  }

  async update(id: string, stockData: Partial<Stock>): Promise<Stock> {
    const { data, error } = await supabase
      .from("stocks")
      .update({
        name: stockData.name,
        sector: stockData.sector,
        industry: stockData.industry,
        market_cap: stockData.marketCap,
        currency: stockData.currency,
        is_active: stockData.isActive,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update stock: ${error.message}`)

    return this.mapToStock(data)
  }

  async getLatestPrice(stockId: string): Promise<StockPrice | null> {
    const { data, error } = await supabase
      .from("stock_prices")
      .select("*")
      .eq("stock_id", stockId)
      .order("timestamp", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) return null

    return this.mapToStockPrice(data)
  }

  async getPriceHistory(stockId: string, from: Date, to: Date): Promise<StockPrice[]> {
    const { data, error } = await supabase
      .from("stock_prices")
      .select("*")
      .eq("stock_id", stockId)
      .gte("timestamp", from.toISOString())
      .lte("timestamp", to.toISOString())
      .order("timestamp", { ascending: true })

    if (error) throw new Error(`Failed to get price history: ${error.message}`)

    return data?.map(this.mapToStockPrice) || []
  }

  async addPrice(priceData: Omit<StockPrice, "id" | "createdAt">): Promise<StockPrice> {
    const { data, error } = await supabase
      .from("stock_prices")
      .insert({
        stock_id: priceData.stockId,
        price: priceData.price,
        open_price: priceData.openPrice,
        high_price: priceData.highPrice,
        low_price: priceData.lowPrice,
        volume: priceData.volume,
        change_amount: priceData.changeAmount,
        change_percent: priceData.changePercent,
        timestamp: priceData.timestamp.toISOString(),
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to add stock price: ${error.message}`)

    return this.mapToStockPrice(data)
  }

  async getQuote(stockId: string): Promise<StockQuote | null> {
    const stock = await this.findById(stockId)
    if (!stock) return null

    const currentPrice = await this.getLatestPrice(stockId)
    if (!currentPrice) return null

    // Get previous day's closing price for comparison
    const previousDay = new Date(currentPrice.timestamp)
    previousDay.setDate(previousDay.getDate() - 1)

    const { data: previousPriceData } = await supabase
      .from("stock_prices")
      .select("price")
      .eq("stock_id", stockId)
      .lt("timestamp", previousDay.toISOString())
      .order("timestamp", { ascending: false })
      .limit(1)
      .single()

    const previousClose = previousPriceData?.price || currentPrice.price

    return {
      stock,
      currentPrice,
      previousClose,
      dayChange: currentPrice.changeAmount || 0,
      dayChangePercent: currentPrice.changePercent || 0,
      volume: currentPrice.volume || 0,
      marketCap: stock.marketCap,
    }
  }

  async getQuotes(stockIds: string[]): Promise<Record<string, StockQuote>> {
    const quotes: Record<string, StockQuote> = {}

    // Batch fetch stocks and their latest prices
    const { data: stocksData, error: stocksError } = await supabase.from("stocks").select("*").in("id", stockIds)

    if (stocksError) throw new Error(`Failed to get stocks: ${stocksError.message}`)

    const { data: pricesData, error: pricesError } = await supabase
      .from("stock_prices")
      .select("*")
      .in("stock_id", stockIds)
      .order("timestamp", { ascending: false })

    if (pricesError) throw new Error(`Failed to get prices: ${pricesError.message}`)

    // Group prices by stock_id and get the latest for each
    const latestPrices: Record<string, any> = {}
    pricesData?.forEach((price) => {
      if (
        !latestPrices[price.stock_id] ||
        new Date(price.timestamp) > new Date(latestPrices[price.stock_id].timestamp)
      ) {
        latestPrices[price.stock_id] = price
      }
    })

    // Build quotes
    stocksData?.forEach((stockData) => {
      const stock = this.mapToStock(stockData)
      const priceData = latestPrices[stock.id]

      if (priceData) {
        const currentPrice = this.mapToStockPrice(priceData)
        quotes[stock.id] = {
          stock,
          currentPrice,
          previousClose: currentPrice.price,
          dayChange: currentPrice.changeAmount || 0,
          dayChangePercent: currentPrice.changePercent || 0,
          volume: currentPrice.volume || 0,
          marketCap: stock.marketCap,
        }
      }
    })

    return quotes
  }

  async getTopStocks(exchange: string, limit = 20): Promise<Stock[]> {
    const { data, error } = await supabase
      .from("stocks")
      .select("*")
      .eq("exchange", exchange)
      .eq("is_active", true)
      .order("market_cap", { ascending: false, nullsLast: true })
      .limit(limit)

    if (error) throw new Error(`Failed to get top stocks: ${error.message}`)

    return data?.map(this.mapToStock) || []
  }

  async getAllActiveStocks(exchange?: string): Promise<Stock[]> {
    let query = supabase.from("stocks").select("*").eq("is_active", true)

    if (exchange) {
      query = query.eq("exchange", exchange)
    }

    const { data, error } = await query.order("symbol")

    if (error) throw new Error(`Failed to get active stocks: ${error.message}`)

    return data?.map(this.mapToStock) || []
  }

  private mapToStock(data: any): Stock {
    return {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      exchange: data.exchange,
      sector: data.sector,
      industry: data.industry,
      marketCap: data.market_cap,
      currency: data.currency,
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }

  private mapToStockPrice(data: any): StockPrice {
    return {
      id: data.id,
      stockId: data.stock_id,
      price: Number(data.price),
      openPrice: data.open_price ? Number(data.open_price) : undefined,
      highPrice: data.high_price ? Number(data.high_price) : undefined,
      lowPrice: data.low_price ? Number(data.low_price) : undefined,
      volume: data.volume,
      changeAmount: data.change_amount ? Number(data.change_amount) : undefined,
      changePercent: data.change_percent ? Number(data.change_percent) : undefined,
      timestamp: new Date(data.timestamp),
      createdAt: new Date(data.created_at),
    }
  }
}
