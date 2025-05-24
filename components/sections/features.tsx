"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Search, Bell, BarChart3, Users, Shield, Smartphone, Globe, Zap } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: TrendingUp,
    title: "Real-time Market Data",
    description: "Live quotes, charts, and market movements from NYSE, NASDAQ, and BIST exchanges",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900",
  },
  {
    icon: Search,
    title: "Advanced Screener",
    description: "Filter stocks by technical indicators, fundamentals, and custom criteria",
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get notified about price movements, news, and trading opportunities",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900",
  },
  {
    icon: BarChart3,
    title: "Portfolio Tracking",
    description: "Monitor your investments with detailed performance analytics",
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900",
  },
  {
    icon: Users,
    title: "Community Forum",
    description: "Share insights and learn from experienced traders and investors",
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Bank-level security with encrypted data and secure authentication",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Trade and analyze on the go with our responsive mobile interface",
    color: "text-pink-600",
    bgColor: "bg-pink-100 dark:bg-pink-900",
  },
  {
    icon: Globe,
    title: "Global Markets",
    description: "Access to international markets with multi-currency support",
    color: "text-teal-600",
    bgColor: "bg-teal-100 dark:bg-teal-900",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Ultra-low latency data feeds and instant order execution",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">✨ Platform Features</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Smart Trading
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive tools and features designed to give you the edge in today's fast-moving markets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-200 dark:hover:border-blue-800">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
