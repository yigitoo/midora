import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST() {
  try {
    // Fetch BIST stocks from Bigpara API
    const response = await fetch("https://bigpara.hurriyet.com.tr/api/v1/hisse/list", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid data format from API")
    }

    // Transform and clean the data
    const stocks = data.data
      .filter((stock: any) => stock.kod && stock.ad) // Filter out invalid entries
      .map((stock: any) => ({
        symbol: stock.kod.toString().toUpperCase(),
        company_name: stock.ad || stock.kod,
        sector: stock.sektor || "Unknown",
        industry: stock.alt_sektor || stock.sektor || "Unknown",
        market_cap: stock.piyasa_degeri ? Number(stock.piyasa_degeri) : 0,
        price: stock.kapanis ? Number.parseFloat(stock.kapanis.toString()) : 0,
        change_percent: stock.degisim_oran ? Number.parseFloat(stock.degisim_oran.toString()) : 0,
        volume: stock.hacim ? Number.parseInt(stock.hacim.toString()) : 0,
        pe_ratio: stock.fk ? Number.parseFloat(stock.fk.toString()) : null,
        dividend_yield: stock.temettuu_verimi ? Number.parseFloat(stock.temettuu_verimi.toString()) : null,
      }))
      .filter((stock: any) => stock.symbol && stock.company_name) // Final filter

    if (stocks.length === 0) {
      throw new Error("No valid stocks found in API response")
    }

    // Clear existing BIST data and insert new data
    const { error: deleteError } = await supabase.from("bist_stocks").delete().neq("id", 0)

    if (deleteError) {
      console.error("Error clearing BIST data:", deleteError)
    }

    // Insert new data in batches
    const batchSize = 100
    let insertedCount = 0

    for (let i = 0; i < stocks.length; i += batchSize) {
      const batch = stocks.slice(i, i + batchSize)
      const { error: insertError, count } = await supabase
        .from("bist_stocks")
        .insert(batch)
        .select("id", { count: "exact" })

      if (insertError) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, insertError)
      } else {
        insertedCount += count || 0
      }
    }

    return NextResponse.json({
      success: true,
      total: stocks.length,
      inserted: insertedCount,
      message: `Successfully updated ${insertedCount} BIST stocks`,
    })
  } catch (error) {
    console.error("Error updating BIST stocks:", error)
    return NextResponse.json(
      {
        error: "Failed to update BIST stocks",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return POST() // Allow GET requests to trigger update
}
