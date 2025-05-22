export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  marketCap: number
  volume: number
  industry: string
  pe: number
  dividendYield: number
  beta: number
  eps: number
}

interface StockFilters {
  industry: string
  marketCap: "all" | "micro" | "small" | "mid" | "large" | "mega"
  volume: [number, number]
  priceRange: [number, number]
}

const stocks: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 150.25,
    change: 2.75,
    changePercent: 1.86,
    marketCap: 2450000000000,
    volume: 82000000,
    industry: "Technology",
    pe: 28.5,
    dividendYield: 0.65,
    beta: 1.2,
    eps: 5.27,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 305.75,
    change: 5.2,
    changePercent: 1.73,
    marketCap: 2300000000000,
    volume: 25000000,
    industry: "Technology",
    pe: 32.1,
    dividendYield: 0.85,
    beta: 0.93,
    eps: 9.52,
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    price: 165.5,
    change: -0.75,
    changePercent: -0.45,
    marketCap: 435000000000,
    volume: 6500000,
    industry: "Healthcare",
    pe: 23.8,
    dividendYield: 2.65,
    beta: 0.71,
    eps: 6.95,
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 145.8,
    change: 2.3,
    changePercent: 1.6,
    marketCap: 430000000000,
    volume: 12000000,
    industry: "Finance",
    pe: 11.2,
    dividendYield: 2.75,
    beta: 1.15,
    eps: 13.02,
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    price: 230.4,
    change: 3.6,
    changePercent: 1.59,
    marketCap: 485000000000,
    volume: 7500000,
    industry: "Finance",
    pe: 37.5,
    dividendYield: 0.65,
    beta: 0.97,
    eps: 6.14,
  },
  {
    symbol: "PG",
    name: "Procter & Gamble Co.",
    price: 140.2,
    change: -0.3,
    changePercent: -0.21,
    marketCap: 345000000000,
    volume: 6000000,
    industry: "Consumer Goods",
    pe: 24.6,
    dividendYield: 2.45,
    beta: 0.42,
    eps: 5.7,
  },
  {
    symbol: "UNH",
    name: "UnitedHealth Group Inc.",
    price: 410.5,
    change: 5.8,
    changePercent: 1.43,
    marketCap: 385000000000,
    volume: 3000000,
    industry: "Healthcare",
    pe: 22.8,
    dividendYield: 1.35,
    beta: 0.77,
    eps: 18.01,
  },
  {
    symbol: "HD",
    name: "The Home Depot Inc.",
    price: 315.25,
    change: 4.25,
    changePercent: 1.37,
    marketCap: 335000000000,
    volume: 3500000,
    industry: "Consumer Goods",
    pe: 21.1,
    dividendYield: 2.15,
    beta: 1.03,
    eps: 14.94,
  },
  {
    symbol: "MA",
    name: "Mastercard Inc.",
    price: 355.6,
    change: 6.4,
    changePercent: 1.83,
    marketCap: 350000000000,
    volume: 3000000,
    industry: "Finance",
    pe: 35.2,
    dividendYield: 0.55,
    beta: 1.08,
    eps: 10.1,
  },
  {
    symbol: "DIS",
    name: "The Walt Disney Company",
    price: 175.3,
    change: -1.2,
    changePercent: -0.68,
    marketCap: 320000000000,
    volume: 9000000,
    industry: "Communication Services",
    pe: 0,
    dividendYield: 0,
    beta: 1.19,
    eps: -1.57,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 225.3,
    change: 7.8,
    changePercent: 3.58,
    marketCap: 558000000000,
    volume: 42000000,
    industry: "Technology",
    pe: 66.5,
    dividendYield: 0.12,
    beta: 1.38,
    eps: 3.39,
  },
  {
    symbol: "BA",
    name: "The Boeing Company",
    price: 220.75,
    change: 3.25,
    changePercent: 1.49,
    marketCap: 130000000000,
    volume: 15000000,
    industry: "Industrials",
    pe: 0,
    dividendYield: 0,
    beta: 1.62,
    eps: -20.88,
  },
  {
    symbol: "MCD",
    name: "McDonald's Corporation",
    price: 235.6,
    change: 1.1,
    changePercent: 0.47,
    marketCap: 175000000000,
    volume: 2500000,
    industry: "Consumer Goods",
    pe: 31.2,
    dividendYield: 2.25,
    beta: 0.63,
    eps: 7.55,
  },
  {
    symbol: "CRM",
    name: "Salesforce.com Inc.",
    price: 220.4,
    change: 4.6,
    changePercent: 2.13,
    marketCap: 205000000000,
    volume: 6000000,
    industry: "Technology",
    pe: 54.8,
    dividendYield: 0,
    beta: 1.09,
    eps: 4.02,
  },
  {
    symbol: "CSCO",
    name: "Cisco Systems Inc.",
    price: 52.8,
    change: 0.3,
    changePercent: 0.57,
    marketCap: 220000000000,
    volume: 18000000,
    industry: "Technology",
    pe: 21.9,
    dividendYield: 2.75,
    beta: 0.91,
    eps: 2.41,
  },
  {
    symbol: "WMT",
    name: "Walmart Inc.",
    price: 140.5,
    change: -0.5,
    changePercent: -0.35,
    marketCap: 395000000000,
    volume: 7000000,
    industry: "Consumer Goods",
    pe: 29.7,
    dividendYield: 1.55,
    beta: 0.48,
    eps: 4.73,
  },
  {
    symbol: "KO",
    name: "The Coca-Cola Company",
    price: 55.2,
    change: 0.2,
    changePercent: 0.36,
    marketCap: 240000000000,
    volume: 13000000,
    industry: "Consumer Goods",
    pe: 30.3,
    dividendYield: 3.05,
    beta: 0.58,
    eps: 1.82,
  },
  {
    symbol: "MRK",
    name: "Merck & Co. Inc.",
    price: 80.9,
    change: 1.4,
    changePercent: 1.76,
    marketCap: 205000000000,
    volume: 9000000,
    industry: "Healthcare",
    pe: 28.7,
    dividendYield: 3.35,
    beta: 0.41,
    eps: 2.82,
  },
  {
    symbol: "NKE",
    name: "Nike Inc.",
    price: 135.7,
    change: 2.2,
    changePercent: 1.65,
    marketCap: 215000000000,
    volume: 6500000,
    industry: "Consumer Goods",
    pe: 38.2,
    dividendYield: 0.85,
    beta: 0.86,
    eps: 3.55,
  },
  {
    symbol: "AXP",
    name: "American Express Company",
    price: 165.3,
    change: 3.8,
    changePercent: 2.35,
    marketCap: 130000000000,
    volume: 3500000,
    industry: "Finance",
    pe: 27.1,
    dividendYield: 1.05,
    beta: 1.28,
    eps: 6.1,
  },
  {
    symbol: "GS",
    name: "The Goldman Sachs Group Inc.",
    price: 355.8,
    change: 7.6,
    changePercent: 2.18,
    marketCap: 120000000000,
    volume: 2500000,
    industry: "Finance",
    pe: 7.5,
    dividendYield: 2.15,
    beta: 1.45,
    eps: 47.44,
  },
  {
    symbol: "CAT",
    name: "Caterpillar Inc.",
    price: 225.4,
    change: 4.9,
    changePercent: 2.22,
    marketCap: 125000000000,
    volume: 3000000,
    industry: "Industrials",
    pe: 36.2,
    dividendYield: 2.05,
    beta: 0.93,
    eps: 6.22,
  },
  {
    symbol: "HON",
    name: "Honeywell International Inc.",
    price: 220.3,
    change: 1.8,
    changePercent: 0.82,
    marketCap: 155000000000,
    volume: 2500000,
    industry: "Industrials",
    pe: 33.7,
    dividendYield: 1.75,
    beta: 1.14,
    eps: 6.54,
  },
  {
    symbol: "AMGN",
    name: "Amgen Inc.",
    price: 245.6,
    change: -1.4,
    changePercent: -0.57,
    marketCap: 140000000000,
    volume: 2500000,
    industry: "Healthcare",
    pe: 19.8,
    dividendYield: 2.85,
    beta: 0.59,
    eps: 12.4,
  },
  {
    symbol: "MMM",
    name: "3M Company",
    price: 195.7,
    change: 0.7,
    changePercent: 0.36,
    marketCap: 115000000000,
    volume: 2000000,
    industry: "Industrials",
    pe: 19.2,
    dividendYield: 3.05,
    beta: 0.96,
    eps: 10.19,
  },
  {
    symbol: "TRV",
    name: "The Travelers Companies Inc.",
    price: 155.4,
    change: 1.2,
    changePercent: 0.78,
    marketCap: 39000000000,
    volume: 1200000,
    industry: "Finance",
    pe: 14.1,
    dividendYield: 2.25,
    beta: 0.74,
    eps: 11.02,
  },
  {
    symbol: "DOW",
    name: "Dow Inc.",
    price: 62.8,
    change: 1.3,
    changePercent: 2.11,
    marketCap: 47000000000,
    volume: 4000000,
    industry: "Materials",
    pe: 7.8,
    dividendYield: 4.45,
    beta: 1.43,
    eps: 8.05,
  },
  {
    symbol: "CVX",
    name: "Chevron Corporation",
    price: 105.3,
    change: 2.1,
    changePercent: 2.03,
    marketCap: 205000000000,
    volume: 9000000,
    industry: "Energy",
    pe: 0,
    dividendYield: 5.05,
    beta: 1.31,
    eps: -4.2,
  },
  {
    symbol: "VZ",
    name: "Verizon Communications Inc.",
    price: 56.2,
    change: -0.3,
    changePercent: -0.53,
    marketCap: 235000000000,
    volume: 15000000,
    industry: "Communication Services",
    pe: 12.3,
    dividendYield: 4.45,
    beta: 0.44,
    eps: 4.57,
  },
  {
    symbol: "WBA",
    name: "Walgreens Boots Alliance Inc.",
    price: 49.8,
    change: 0.6,
    changePercent: 1.22,
    marketCap: 43000000000,
    volume: 5500000,
    industry: "Consumer Goods",
    pe: 0,
    dividendYield: 3.75,
    beta: 0.55,
    eps: -0.36,
  },
]

export function searchStocks(query: string): Stock[] {
  return stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase()),
  )
}

export function getStockDetails(symbol: string): Stock | undefined {
  return stocks.find((stock) => stock.symbol === symbol)
}

export function getTopStocks(): Stock[] {
  return stocks.sort((a, b) => b.marketCap - a.marketCap)
}

export function generateFakeStockData(symbol: string) {
  const basePrice = stocks.find((s) => s.symbol === symbol)?.price || 100
  const data = []
  for (let i = 0; i < 30; i++) {
    data.push({
      date: new Date(2023, 0, i + 1).toISOString().split("T")[0],
      price: basePrice + Math.random() * 20 - 10,
    })
  }
  return data
}

export function filterStocks(filters: StockFilters): Stock[] {
  return stocks.filter((stock) => {
    const marketCapInBillions = stock.marketCap / 1e9
    const volumeInMillions = stock.volume / 1e6

    return (
      (filters.industry === "All" || stock.industry === filters.industry) &&
      (filters.marketCap === "all" ||
        (filters.marketCap === "micro" && marketCapInBillions >= 0.05 && marketCapInBillions < 0.3) ||
        (filters.marketCap === "small" && marketCapInBillions >= 0.3 && marketCapInBillions < 2) ||
        (filters.marketCap === "mid" && marketCapInBillions >= 2 && marketCapInBillions < 10) ||
        (filters.marketCap === "large" && marketCapInBillions >= 10 && marketCapInBillions < 200) ||
        (filters.marketCap === "mega" && marketCapInBillions >= 200)) &&
      volumeInMillions >= filters.volume[0] &&
      volumeInMillions <= filters.volume[1] &&
      stock.price >= filters.priceRange[0] &&
      stock.price <= filters.priceRange[1]
    )
  })
}
