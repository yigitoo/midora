import { type NextRequest, NextResponse } from "next/server"
import { Container } from "@/src/infrastructure/di/Container"
import type { StockService } from "@/src/application/services/StockService"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const symbol = params.symbol
    const searchParams = request.nextUrl.searchParams
    const exchange = searchParams.get("exchange") || undefined

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    const container = Container.getInstance()
    const stockService = container.get<StockService>("stockService")

    const quote = await stockService.getStockQuote(symbol, exchange)

    if (!quote) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 })
    }

    return NextResponse.json({ quote })
  } catch (error) {
    console.error("Error in stock quote API:", error)
    return NextResponse.json({ error: "Failed to get stock quote" }, { status: 500 })
  }
}
