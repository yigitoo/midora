import { type NextRequest, NextResponse } from "next/server"
import { stockService } from "@/lib/stockService"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const filters = {
      exchange: searchParams.get("exchange") || undefined,
      industry: searchParams.get("industry") || undefined,
      marketCap: searchParams.get("marketCap") || undefined,
    }

    // Handle range filters
    if (searchParams.has("volumeMin") && searchParams.has("volumeMax")) {
      filters.volume = [
        Number.parseFloat(searchParams.get("volumeMin") || "0"),
        Number.parseFloat(searchParams.get("volumeMax") || "1000000000"),
      ]
    }

    if (searchParams.has("priceMin") && searchParams.has("priceMax")) {
      filters.priceRange = [
        Number.parseFloat(searchParams.get("priceMin") || "0"),
        Number.parseFloat(searchParams.get("priceMax") || "1000000"),
      ]
    }

    const stocks = await stockService.filterStocks(filters)

    return NextResponse.json(stocks)
  } catch (error) {
    console.error("Error in filter stocks API:", error)
    return NextResponse.json({ error: "Failed to filter stocks" }, { status: 500 })
  }
}
