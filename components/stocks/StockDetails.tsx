'use client'

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { type Stock, generateFakeStockData } from "@/lib/mockStockApi"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"

interface StockDetailsProps {
  stock: Stock,
}

export function StockDetails({ stock }: StockDetailsProps) {
  const chartData = generateFakeStockData(stock.symbol)

  return (
    <motion.div
      className="stock-details shadow-blue-500/50 mt-8 p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-primary">{stock.name}</h2>
          <p className="text-xl text-primary-100">{stock.symbol}</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold">${stock.price.toFixed(2)}</p>
          <p className={`text-xl ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
            {stock.change >= 0 ? "+" : ""}
            {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div>
          <p className="text-sm text-gray-600">Market Cap</p>
          <p className="text-lg font-semibold">${(stock.marketCap / 1e9).toFixed(2)}B</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Volume</p>
          <p className="text-lg font-semibold">{(stock.volume / 1e6).toFixed(2)}M</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">52 Week High</p>
          <p className="text-lg font-semibold">${(stock.price * 1.2).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">52 Week Low</p>
          <p className="text-lg font-semibold">${(stock.price * 0.8).toFixed(2)}</p>
        </div>
      </div>
      <Tabs defaultValue="1M" className="my-8 border-2 border-blue p-4">
        <TabsList>
          <TabsTrigger value="1D">1D</TabsTrigger>
          <TabsTrigger value="1W">1W</TabsTrigger>
          <TabsTrigger value="1M">1M</TabsTrigger>
          <TabsTrigger value="3M">3M</TabsTrigger>
          <TabsTrigger value="1Y">1Y</TabsTrigger>
          <TabsTrigger value="5Y">5Y</TabsTrigger>
        </TabsList>
        <TabsContent value="1M" className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#718096" />
              <YAxis domain={["dataMin", "dataMax"]} stroke="#718096" />
              <Tooltip
                contentStyle={{ background: "white", border: "none", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
              />
              <Line type="monotone" dataKey="price" stroke="#4299e1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Company Overview</h3>
          <p className="text-primary mb-4">
            {stock.name} is a leading company in the technology sector, known for its innovative products and services.
            With a strong market presence and consistent growth, it continues to be a popular choice among investors.
          </p>
          <Button>Read More</Button>
        </div>
        <div className="border-2 p-4 rounded-lg border-primary">
          <h3 className="text-xl font-bold mb-4">Key Statistics</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-600">P/E Ratio</span>
              <span className="font-semibold">32.5</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Dividend Yield</span>
              <span className="font-semibold">1.2%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Beta</span>
              <span className="font-semibold">1.15</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">EPS</span>
              <span className="font-semibold">$4.62</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
