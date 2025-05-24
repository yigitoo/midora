import { type NextRequest, NextResponse } from "next/server"
import { WatchlistService } from "@/lib/watchlist-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const watchlists = await WatchlistService.getUserWatchlists(userId)
    return NextResponse.json({ watchlists })
  } catch (error: any) {
    console.error("Error fetching watchlists:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, description, isPublic } = body

    if (!userId || !name) {
      return NextResponse.json({ error: "User ID and name are required" }, { status: 400 })
    }

    const watchlist = await WatchlistService.createWatchlist(userId, name, description, isPublic)
    return NextResponse.json({ watchlist })
  } catch (error: any) {
    console.error("Error creating watchlist:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
