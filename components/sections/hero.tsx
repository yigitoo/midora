"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, TrendingUp, BarChart3, Users, Zap } from "lucide-react"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="container mx-auto px-4 py-20 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                🚀 Professional Trading Platform
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Midora
                </span>
                <br />
                <span className="text-3xl md:text-4xl text-muted-foreground">Advanced Market Analysis</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Professional-grade financial analysis platform with real-time data from NYSE, NASDAQ, and BIST. Make
                informed investment decisions with our comprehensive tools and community insights.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
              >
                <Link href="/auth/register">
                  Start Trading <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link href="/markets">Explore Markets</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid md:grid-cols-4 gap-6 mb-16"
          >
            <Card className="border-2 border-blue-100 dark:border-blue-900 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Real-time Data</h3>
                <p className="text-muted-foreground text-sm">Live market data from major exchanges</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 dark:border-purple-900 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground text-sm">Professional technical indicators</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 dark:border-green-900 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Community</h3>
                <p className="text-muted-foreground text-sm">Connect with fellow investors</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100 dark:border-orange-900 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Fast Execution</h3>
                <p className="text-muted-foreground text-sm">Lightning-fast trade execution</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative"
          >
            <Card className="overflow-hidden border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
                  <h2 className="text-3xl font-bold mb-4">Global Market Coverage</h2>
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-4xl font-bold">NYSE</div>
                      <div className="text-blue-100">New York Stock Exchange</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold">NASDAQ</div>
                      <div className="text-blue-100">Technology Focused</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold">BIST</div>
                      <div className="text-blue-100">Borsa Istanbul</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
