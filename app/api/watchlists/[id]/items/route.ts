import { type NextRequest, NextResponse } from "next/server"
import { WatchlistService } from "@/lib/watchlist-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const items = await WatchlistService.getWatchlistItems(params.id)
    return NextResponse.json({ items })
  } catch (error: any) {
    console.error("Error fetching watchlist items:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { symbol, exchange } = body

    if (!symbol || !exchange) {
      return NextResponse.json({ error: "Symbol and exchange are required" }, { status: 400 })
    }

    const item = await WatchlistService.addStockToWatchlist(params.id, symbol, exchange)
    return NextResponse.json({ item })
  } catch (error: any) {
    console.error("Error adding stock to watchlist:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")
    const exchange = searchParams.get("exchange")

    if (!symbol || !exchange) {
      return NextResponse.json({ error: "Symbol and exchange are required" }, { status: 400 })
    }

    await WatchlistService.removeStockFromWatchlist(params.id, symbol, exchange)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error removing stock from watchlist:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
