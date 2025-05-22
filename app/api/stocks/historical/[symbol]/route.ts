import { type NextRequest, NextResponse } from "next/server"
import { stockService } from "@/lib/stockService"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const symbol = params.symbol
    const searchParams = request.nextUrl.searchParams
    const interval = searchParams.get("interval") || "daily"
    const outputsize = searchParams.get("outputsize") || "compact"

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    const data = await stockService.getHistoricalData(symbol, interval, outputsize)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in historical data API:", error)
    return NextResponse.json({ error: "Failed to fetch historical data" }, { status: 500 })
  }
}
