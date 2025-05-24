"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function CTA() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-12 text-white text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-white/[0.1]" />
                  <div className="relative z-10">
                    <Sparkles className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
                    <h2 className="text-4xl font-bold mb-4">Ready to Start Your Trading Journey?</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                      Join thousands of successful traders who trust Midora for their investment decisions. Start with a
                      free account today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                        <Link href="/auth/register">
                          Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        asChild
                        className="text-lg px-8 border-white bg-white text-black hover:bg-white hover:text-blue-600"
                      >
                        <Link href="/about">Learn More</Link>
                      </Button>
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
