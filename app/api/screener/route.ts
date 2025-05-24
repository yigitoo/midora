import { type NextRequest, NextResponse } from "next/server"
import { MarketScreener, type ScreenerFilters } from "@/lib/market-screener"

export async function POST(request: NextRequest) {
  try {
    const filters: ScreenerFilters = await request.json()
    const result = await MarketScreener.screenStocks(filters)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error screening stocks:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const preset = searchParams.get("preset")

    if (preset) {
      const presets = MarketScreener.getPresetScreens()
      const filters = presets[preset]

      if (!filters) {
        return NextResponse.json({ error: "Preset not found" }, { status: 404 })
      }

      const result = await MarketScreener.screenStocks(filters)
      return NextResponse.json(result)
    }

    // Return available presets
    const presets = MarketScreener.getPresetScreens()
    return NextResponse.json({ presets: Object.keys(presets) })
  } catch (error: any) {
    console.error("Error getting screener data:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
