import { NextResponse } from 'next/server'
import clientPromise from '@/lib/database'

export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('midora')

    const portfolios = await db.collection('celebrity_portfolios').find({}).toArray()

    const formattedPortfolios = portfolios.map(portfolio => ({
      id: portfolio._id.toString(),
      name: portfolio.name,
      image: portfolio.image,
      netWorth: portfolio.netWorth,
      mainInvestments: portfolio.mainInvestments,
      topStocks: portfolio.topStocks,
      lastUpdate: portfolio.lastUpdate
    }))

    return NextResponse.json(formattedPortfolios)
  } catch (error) {
    console.error('Portfolio fetch error:', error)
    return NextResponse.json(
      { error: 'Portföy bilgileri yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}
