import { type NextRequest, NextResponse } from "next/server"
import { WatchlistService } from "@/lib/watchlist-service"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, description, isPublic } = body

    const watchlist = await WatchlistService.updateWatchlist(params.id, {
      name,
      description,
      is_public: isPublic,
    })

    return NextResponse.json({ watchlist })
  } catch (error: any) {
    console.error("Error updating watchlist:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await WatchlistService.deleteWatchlist(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting watchlist:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
