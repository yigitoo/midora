import { type NextRequest, NextResponse } from "next/server"
import { stockService } from "@/lib/stockService"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const symbol = params.symbol

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    const stock = await stockService.getStockDetails(symbol)

    return NextResponse.json(stock)
  } catch (error) {
    console.error("Error in stock details API:", error)
    return NextResponse.json({ error: "Failed to fetch stock details" }, { status: 500 })
  }
}
