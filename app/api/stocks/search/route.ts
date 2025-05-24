import { type NextRequest, NextResponse } from "next/server"
import { stockService } from "@/lib/stock-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const exchange = searchParams.get("exchange") || undefined

    const stocks = await stockService.searchStocks(query, exchange)

    return NextResponse.json({ stocks })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Failed to search stocks" }, { status: 500 })
  }
}
