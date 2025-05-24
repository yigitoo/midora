"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const stats = [
  { label: "Active Users", value: "50K+", color: "text-blue-600" },
  { label: "Daily Trades", value: "1M+", color: "text-purple-600" },
  { label: "Markets Covered", value: "3", color: "text-green-600" },
  { label: "Uptime", value: "99.9%", color: "text-orange-600" },
]

export function Stats() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Trusted by
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Thousands
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join the growing community of successful traders and investors
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                    <div className="text-muted-foreground font-medium">{stat.label}</div>
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
