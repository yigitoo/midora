import { type NextRequest, NextResponse } from "next/server"
import { Container } from "@/src/infrastructure/di/Container"
import type { NewsService } from "@/src/application/services/NewsService"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const symbol = params.symbol
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    const container = Container.getInstance()
    const newsService = container.get<NewsService>("newsService")

    const articles = await newsService.getStockNews(symbol, limit)

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("Error in stock news API:", error)
    return NextResponse.json({ error: "Failed to get stock news" }, { status: 500 })
  }
}
