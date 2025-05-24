import { type NextRequest, NextResponse } from "next/server"
import { stockService } from "@/lib/stock-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const exchange = searchParams.get("exchange") || "NYSE"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const stocks = await stockService.getTopStocks(exchange, limit)

    return NextResponse.json({ stocks })
  } catch (error) {
    console.error("Top stocks API error:", error)
    return NextResponse.json({ error: "Failed to fetch top stocks" }, { status: 500 })
  }
}
