import { type NextRequest, NextResponse } from "next/server"
import { stockService } from "@/lib/stock-service"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const news = await stockService.getStockNews(params.symbol, limit)

    return NextResponse.json({ news })
  } catch (error) {
    console.error("Stock news API error:", error)
    return NextResponse.json({ error: "Failed to fetch stock news" }, { status: 500 })
  }
}
