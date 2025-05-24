import { createClient } from "@supabase/supabase-js"

export interface Portfolio {
  id: string
  user_id: string
  name: string
  description?: string
  total_value: number
  total_cost: number
  total_gain_loss: number
  total_gain_loss_percentage: number
  created_at: string
  updated_at: string
}

export interface PortfolioHolding {
  id: string
  portfolio_id: string
  symbol: string
  exchange: string
  quantity: number
  average_cost: number
  current_price: number
  market_value: number
  gain_loss: number
  gain_loss_percentage: number
  created_at: string
  updated_at: string
}

export class SupabasePortfolioRepository {
  private supabase

  constructor() {
    this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }

  async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    const { data, error } = await this.supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async getPortfolioHoldings(portfolioId: string): Promise<PortfolioHolding[]> {
    const { data, error } = await this.supabase
      .from("portfolio_holdings")
      .select("*")
      .eq("portfolio_id", portfolioId)
      .order("symbol", { ascending: true })

    if (error) throw error
    return data || []
  }

  async createPortfolio(portfolio: Omit<Portfolio, "id" | "created_at" | "updated_at">): Promise<Portfolio> {
    const { data, error } = await this.supabase.from("portfolios").insert(portfolio).select().single()

    if (error) throw error
    return data
  }

  async addHolding(holding: Omit<PortfolioHolding, "id" | "created_at" | "updated_at">): Promise<PortfolioHolding> {
    const { data, error } = await this.supabase.from("portfolio_holdings").insert(holding).select().single()

    if (error) throw error
    return data
  }

  async updateHolding(holdingId: string, updates: Partial<PortfolioHolding>): Promise<PortfolioHolding> {
    const { data, error } = await this.supabase
      .from("portfolio_holdings")
      .update(updates)
      .eq("id", holdingId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteHolding(holdingId: string): Promise<void> {
    const { error } = await this.supabase.from("portfolio_holdings").delete().eq("id", holdingId)

    if (error) throw error
  }

  async deletePortfolio(portfolioId: string): Promise<void> {
    const { error } = await this.supabase.from("portfolios").delete().eq("id", portfolioId)

    if (error) throw error
  }
}
