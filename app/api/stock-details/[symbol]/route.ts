import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { symbol: string } }) {
  try {
    const { symbol } = params

    // Fetch detailed stock data from Bigpara API
    const response = await fetch(`https://bigpara.hurriyet.com.tr/api/v1/borsa/hisseyuzeysel/${symbol}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch stock details")
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching stock details:", error)
    return NextResponse.json({ error: "Failed to fetch stock details" }, { status: 500 })
  }
}
