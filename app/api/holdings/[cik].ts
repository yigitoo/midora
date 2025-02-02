'use server';

import { NextApiRequest, NextApiResponse } from 'next';
import 'dotenv/config';

const API_KEY = process.env.FINANCIAL_MODELING_PREP_API_KEY;
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cik } = req.query;

  console.log(cik)
  return;
  try {
    // Fetch institutional holdings data
    const response = await fetch(
      `${BASE_URL}/institutional-holder/list?cik=${cik}&apikey=${API_KEY}`
    );
    console.log(response)
    if (!response.ok) {
      throw new Error('Failed to fetch from FMP API');
    }

    const data = await response.json();

    // Process and format the holdings data
    interface Holding {
      name: string;
      portfolioPercent: number;
      sharesNumber: number;
      value: number;
    }

    interface HoldingsResponse {
      name: string;
      portfolioPercent: number;
      sharesNumber: number;
      value: number;
    }

    const holdings: Holding[] = data.map((holding: HoldingsResponse) => ({
      company: holding.name,
      percentage: holding.portfolioPercent,
      shares: holding.sharesNumber,
      value: holding.value
    }));

    // Cache the response for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).json(holdings);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch holdings data' });
  }
}
