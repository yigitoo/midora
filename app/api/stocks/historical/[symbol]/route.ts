import { type NextRequest, NextResponse } from "next/server"
import { stockService } from "@/lib/stock-service"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const interval = searchParams.get("interval") || "daily"

    const data = await stockService.getHistoricalData(params.symbol, interval)

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Historical data API error:", error)
    return NextResponse.json({ error: "Failed to fetch historical data" }, { status: 500 })
  }
}
