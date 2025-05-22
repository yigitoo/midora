import { type NextRequest, NextResponse } from "next/server"
import { stockService } from "@/lib/stockService"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const exchange = searchParams.get("exchange") || "NYSE"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const stocks = await stockService.getTopStocks(exchange, limit)

    return NextResponse.json(stocks)
  } catch (error) {
    console.error("Error in top stocks API:", error)
    return NextResponse.json({ error: "Failed to fetch top stocks" }, { status: 500 })
  }
}
