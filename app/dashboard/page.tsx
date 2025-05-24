"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { TrendingUp, DollarSign, BarChart3, Users, Bell, Plus, ArrowRight } from "lucide-react"
import { redirect } from "next/navigation"

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </span>
            </h1>
            <p className="text-muted-foreground">Here's your portfolio overview and market insights</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add to Watchlist
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-green-100 dark:border-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">+$1,234.56 (+2.8%)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100 dark:border-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Day's Gain/Loss</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+$892.45</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-green-600">+1.97% today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 dark:border-purple-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-muted-foreground">8 stocks, 4 ETFs</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-100 dark:border-orange-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watchlist Items</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-muted-foreground">3 new alerts</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest trades and portfolio changes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    action: "Bought",
                    symbol: "AAPL",
                    shares: 10,
                    price: 175.43,
                    time: "2 hours ago",
                    type: "buy",
                  },
                  {
                    action: "Sold",
                    symbol: "TSLA",
                    shares: 5,
                    price: 248.5,
                    time: "1 day ago",
                    type: "sell",
                  },
                  {
                    action: "Added to Watchlist",
                    symbol: "NVDA",
                    shares: 0,
                    price: 485.2,
                    time: "2 days ago",
                    type: "watchlist",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          activity.type === "buy"
                            ? "bg-green-600"
                            : activity.type === "sell"
                              ? "bg-red-600"
                              : "bg-blue-600"
                        }`}
                      >
                        {activity.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">
                          {activity.action} {activity.symbol}
                          {activity.shares > 0 && ` (${activity.shares} shares)`}
                        </div>
                        <div className="text-sm text-muted-foreground">{activity.time}</div>
                      </div>
                    </div>
                    {activity.shares > 0 && (
                      <div className="text-right">
                        <div className="font-medium">${activity.price.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">per share</div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Market Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div>
                    <div className="font-medium text-green-800 dark:text-green-200">AAPL Target Hit</div>
                    <div className="text-sm text-green-600 dark:text-green-400">Reached $175.00</div>
                  </div>
                  <Badge className="bg-green-600">New</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div>
                    <div className="font-medium text-blue-800 dark:text-blue-200">NVDA Earnings</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">Tomorrow after market</div>
                  </div>
                  <Badge variant="outline">Upcoming</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <div>
                    <div className="font-medium text-orange-800 dark:text-orange-200">Market Volatility</div>
                    <div className="text-sm text-orange-600 dark:text-orange-400">High VIX detected</div>
                  </div>
                  <Badge variant="secondary">Warning</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-between">
                  <Link href="/markets">
                    Browse Markets
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-between">
                  <Link href="/screener">
                    Stock Screener
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-between">
                  <Link href="/forum">
                    Community Forum
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
