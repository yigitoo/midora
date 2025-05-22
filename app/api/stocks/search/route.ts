import { type NextRequest, NextResponse } from "next/server"
import { stockService } from "@/lib/stockService"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const exchange = searchParams.get("exchange") || undefined

    const stocks = await stockService.searchStocks(query, exchange)

    return NextResponse.json(stocks)
  } catch (error) {
    console.error("Error in stock search API:", error)
    return NextResponse.json({ error: "Failed to search stocks" }, { status: 500 })
  }
}
