import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Award, TrendingUp } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About Midora
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering investors with comprehensive market analysis, real-time data, and intelligent insights across
            global financial markets.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 border-blue-100 dark:border-blue-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-blue-600" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To democratize financial market access by providing professional-grade analysis tools, real-time market
                data, and intelligent insights that help both novice and experienced investors make informed decisions
                across NYSE, NASDAQ, and BIST markets.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 dark:border-purple-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To become the leading platform for global market analysis, where technology meets finance to create
                unprecedented opportunities for wealth creation and financial literacy across diverse market ecosystems.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">What Makes Midora Special</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with fellow investors, share insights, and learn from a vibrant community of market
                  enthusiasts.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Professional Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access institutional-grade analysis tools, technical indicators, and market screening capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Real-time Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get live market data, instant alerts, and real-time portfolio tracking across multiple exchanges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-6">Market Coverage</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge
              variant="secondary"
              className="text-lg px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              NYSE - New York Stock Exchange
            </Badge>
            <Badge
              variant="secondary"
              className="text-lg px-4 py-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            >
              NASDAQ - Technology Focus
            </Badge>
            <Badge
              variant="secondary"
              className="text-lg px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            >
              BIST - Borsa Istanbul
            </Badge>
          </div>
          <p className="text-center text-muted-foreground mt-6 max-w-2xl mx-auto">
            Comprehensive coverage of major global exchanges with real-time data, historical analysis, and cross-market
            correlation insights.
          </p>
        </div>
      </div>
    </div>
  )
}
