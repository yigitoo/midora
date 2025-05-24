import { type NextRequest, NextResponse } from "next/server"
import { stockService } from "@/lib/stock-service"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const exchange = searchParams.get("exchange") || "NYSE"

    const indicators = await stockService.getTechnicalIndicators(params.symbol, exchange)

    if (!indicators) {
      return NextResponse.json({ error: "Insufficient data for technical analysis" }, { status: 404 })
    }

    return NextResponse.json({ indicators })
  } catch (error: any) {
    console.error(`Error getting technical indicators for ${params.symbol}:`, error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
