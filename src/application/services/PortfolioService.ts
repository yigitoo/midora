import {
  SupabasePortfolioRepository,
  type Portfolio,
  type PortfolioHolding,
} from "@/src/infrastructure/repositories/SupabasePortfolioRepository"

export class PortfolioService {
  private repository: SupabasePortfolioRepository

  constructor() {
    this.repository = new SupabasePortfolioRepository()
  }

  async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    return await this.repository.getUserPortfolios(userId)
  }

  async getPortfolioWithHoldings(
    portfolioId: string,
  ): Promise<{ portfolio: Portfolio; holdings: PortfolioHolding[] } | null> {
    try {
      const holdings = await this.repository.getPortfolioHoldings(portfolioId)
      // Note: You'd need to implement getPortfolioById in the repository
      return { portfolio: {} as Portfolio, holdings }
    } catch (error) {
      console.error("Error fetching portfolio:", error)
      return null
    }
  }

  async createPortfolio(userId: string, name: string, description?: string): Promise<Portfolio> {
    return await this.repository.createPortfolio({
      user_id: userId,
      name,
      description,
      total_value: 0,
      total_cost: 0,
      total_gain_loss: 0,
      total_gain_loss_percentage: 0,
    })
  }

  async addHolding(
    portfolioId: string,
    symbol: string,
    exchange: string,
    quantity: number,
    averageCost: number,
    currentPrice: number,
  ): Promise<PortfolioHolding> {
    const marketValue = quantity * currentPrice
    const gainLoss = marketValue - quantity * averageCost
    const gainLossPercentage = ((currentPrice - averageCost) / averageCost) * 100

    return await this.repository.addHolding({
      portfolio_id: portfolioId,
      symbol,
      exchange,
      quantity,
      average_cost: averageCost,
      current_price: currentPrice,
      market_value: marketValue,
      gain_loss: gainLoss,
      gain_loss_percentage: gainLossPercentage,
    })
  }

  async updateHoldingPrice(holdingId: string, currentPrice: number): Promise<PortfolioHolding> {
    // You'd need to fetch the current holding first to calculate new values
    return await this.repository.updateHolding(holdingId, {
      current_price: currentPrice,
      // market_value, gain_loss, and gain_loss_percentage would be recalculated
    })
  }

  async removeHolding(holdingId: string): Promise<void> {
    return await this.repository.deleteHolding(holdingId)
  }

  async deletePortfolio(portfolioId: string): Promise<void> {
    return await this.repository.deletePortfolio(portfolioId)
  }

  async getPortfolioHoldings(portfolioId: string): Promise<PortfolioHolding[]> {
    return await this.repository.getPortfolioHoldings(portfolioId)
  }

  async calculatePortfolioMetrics(portfolioId: string): Promise<{
    totalValue: number
    totalCost: number
    totalGainLoss: number
    totalGainLossPercentage: number
  }> {
    const holdings = await this.repository.getPortfolioHoldings(portfolioId)

    const totalValue = holdings.reduce((sum, holding) => sum + holding.market_value, 0)
    const totalCost = holdings.reduce((sum, holding) => sum + holding.quantity * holding.average_cost, 0)
    const totalGainLoss = totalValue - totalCost
    const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0

    return {
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercentage,
    }
  }
}
