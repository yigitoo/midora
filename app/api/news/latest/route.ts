import { type NextRequest, NextResponse } from "next/server"
import { Container } from "@/src/infrastructure/di/Container"
import type { NewsService } from "@/src/application/services/NewsService"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const container = Container.getInstance()
    const newsService = container.get<NewsService>("newsService")

    const articles = await newsService.getLatestNews(limit)

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("Error in latest news API:", error)
    return NextResponse.json({ error: "Failed to get latest news" }, { status: 500 })
  }
}
