import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    // Fetch BIST stocks from Bigpara API
    const response = await fetch("https://bigpara.hurriyet.com.tr/api/v1/hisse/list", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch BIST data")
    }

    const data = await response.json()

    // Transform and update database
    const stocks = data.data?.map((stock: any) => ({
      symbol: stock.kod,
      company_name: stock.ad || stock.kod,
      sector: stock.sektor || "Unknown",
      industry: stock.alt_sektor || "Unknown",
      market_cap: stock.piyasa_degeri || 0,
      price: Number.parseFloat(stock.kapanis) || 0,
      change_percent: Number.parseFloat(stock.degisim_oran) || 0,
      volume: Number.parseInt(stock.hacim) || 0,
      pe_ratio: Number.parseFloat(stock.fk) || null,
      dividend_yield: Number.parseFloat(stock.temettuu_verimi) || null,
    }))

    if (stocks && stocks.length > 0) {
      // Clear existing BIST data
      await supabase.from("bist_stocks").delete().neq("id", 0)

      // Insert new data
      const { error } = await supabase.from("bist_stocks").insert(stocks)

      if (error) {
        console.error("Error updating BIST stocks:", error)
      }
    }

    return NextResponse.json({ success: true, count: stocks?.length || 0 })
  } catch (error) {
    console.error("Error fetching BIST stocks:", error)
    return NextResponse.json({ error: "Failed to fetch BIST stocks" }, { status: 500 })
  }
}
