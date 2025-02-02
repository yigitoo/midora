import { MongoClient } from 'mongodb'

const seedData = [
  {
    name: "Warren Buffett",
    image: "/images/portfolios/warren_buffet.jpg",
    netWorth: "$110.5B",
    mainInvestments: ["Berkshire Hathaway", "Apple", "Bank of America"],
    topStocks: [
      { name: "AAPL", percentage: 45 },
      { name: "BAC", percentage: 25 },
      { name: "KO", percentage: 15 }
    ],
    lastUpdate: "2024-03-15"
  },
  {
    name: "Bill Gates",
    image: "/images/portfolios/bill_gates.jpg",
    netWorth: "$120.2B",
    mainInvestments: ["Microsoft", "Republic Services", "Canadian Railway"],
    topStocks: [
      { name: "MSFT", percentage: 40 },
      { name: "RSG", percentage: 20 },
      { name: "CNI", percentage: 15 }
    ],
    lastUpdate: "2024-03-15"
  },
  {
    name: "Elon Musk",
    image: "/images/portfolios/elon_musk.jpg",
    netWorth: "$180.8B",
    mainInvestments: ["Tesla", "SpaceX", "X (Twitter)"],
    topStocks: [
      { name: "TSLA", percentage: 60 },
      { name: "SPACEX", percentage: 30 },
      { name: "TWTR", percentage: 10 }
    ],
    lastUpdate: "2024-03-15"
  },
  {
    name: "Mark Cuban",
    image: "/images/portfolios/mark_cuban.jpg",
    netWorth: "$4.6B",
    mainInvestments: ["Dallas Mavericks", "Crypto", "Tech Startups"],
    topStocks: [
      { name: "AMZN", percentage: 35 },
      { name: "NFLX", percentage: 30 },
      { name: "CRYPTO", percentage: 20 }
    ],
    lastUpdate: "2024-03-15"
  },
  {
    name: "Cathie Wood",
    image: "/images/portfolios/cathie_wood.jpg",
    netWorth: "$140M",
    mainInvestments: ["ARK Innovation ETF", "Tesla", "Coinbase"],
    topStocks: [
      { name: "TSLA", percentage: 40 },
      { name: "COIN", percentage: 25 },
      { name: "SQ", percentage: 20 }
    ],
    lastUpdate: "2024-03-15"
  },
  {
    name: "Ray Dalio",
    image: "/images/portfolios/ray_dalio.jpg",
    netWorth: "$19.1B",
    mainInvestments: ["Bridgewater Associates", "Gold", "Bonds"],
    topStocks: [
      { name: "GLD", percentage: 35 },
      { name: "VWO", percentage: 30 },
      { name: "TLT", percentage: 25 }
    ],
    lastUpdate: "2024-03-15"
  },
  {
    name: "Michael Burry",
    image: "/images/portfolios/michael_burry.jpg",
    netWorth: "$300M",
    mainInvestments: ["Real Estate", "Water Rights", "Value Stocks"],
    topStocks: [
      { name: "GEO", percentage: 40 },
      { name: "CVS", percentage: 30 },
      { name: "CXW", percentage: 20 }
    ],
    lastUpdate: "2024-03-15"
  },
  {
    name: "Peter Lynch",
    image: "/images/portfolios/peter_lynch.jpg",
    netWorth: "$450M",
    mainInvestments: ["Retail", "Consumer Goods", "Healthcare"],
    topStocks: [
      { name: "WMT", percentage: 35 },
      { name: "PG", percentage: 30 },
      { name: "JNJ", percentage: 25 }
    ],
    lastUpdate: "2024-03-15"
  },
  {
    name: "George Soros",
    image: "/images/portfolios/george_soros.jpg",
    netWorth: "$8.6B",
    mainInvestments: ["Currency Trading", "Global Markets", "Tech"],
    topStocks: [
      { name: "RIVN", percentage: 35 },
      { name: "AMZN", percentage: 30 },
      { name: "GOOGL", percentage: 25 }
    ],
    lastUpdate: "2024-03-15"
  },
  {
    name: "Charlie Munger",
    image: "/images/portfolios/charlie_munger.jpg",
    netWorth: "$2.3B",
    mainInvestments: ["Berkshire Hathaway", "Costco", "BYD"],
    topStocks: [
      { name: "BRK.A", percentage: 45 },
      { name: "COST", percentage: 30 },
      { name: "BYDDY", percentage: 15 }
    ],
    lastUpdate: "2024-03-15"
  }
]

async function seedDatabase() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!)
    const db = client.db('midora')

    await db.collection('celebrity_portfolios').deleteMany({})
    const result = await db.collection('celebrity_portfolios').insertMany(seedData)

    console.log(`Seeded ${result.insertedCount} portfolios`)
    client.close()
  } catch (error) {
    console.error('Seeding error:', error)
  }
}

seedDatabase()
