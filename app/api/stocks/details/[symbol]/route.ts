import { type NextRequest, NextResponse } from "next/server"
import { stockService } from "@/lib/stock-service"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const exchange = searchParams.get("exchange") || undefined

    const stock = await stockService.getStockDetails(params.symbol, exchange)

    if (!stock) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 })
    }

    return NextResponse.json({ stock })
  } catch (error) {
    console.error("Stock details API error:", error)
    return NextResponse.json({ error: "Failed to fetch stock details" }, { status: 500 })
  }
}
