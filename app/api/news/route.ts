import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "general"
  const query = searchParams.get("q") || ""

  try {
    let searchQuery = ""
    switch (category) {
      case "stocks":
        searchQuery = "stocks OR stock market OR NYSE OR NASDAQ OR trading"
        break
      case "crypto":
        searchQuery = "cryptocurrency OR bitcoin OR ethereum OR crypto"
        break
      case "economy":
        searchQuery = "economy OR economic OR GDP OR inflation OR federal reserve"
        break
      case "turkey":
        searchQuery = "Turkey economy OR BIST OR Turkish lira OR Istanbul"
        break
      default:
        searchQuery = "finance OR financial markets OR investment"
    }

    if (query) {
      searchQuery = query
    }

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&sortBy=publishedAt&pageSize=20&language=en&apiKey=${process.env.NEWS_API_KEY}`,
      {
        headers: {
          "User-Agent": "Midora/1.0",
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch news")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
