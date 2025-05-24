export interface TechnicalIndicators {
  rsi: number
  macd: {
    macd: number
    signal: number
    histogram: number
  }
  bollingerBands: {
    upper: number
    middle: number
    lower: number
  }
  sma20: number
  sma50: number
  ema12: number
  ema26: number
  stochastic: {
    k: number
    d: number
  }
  williamsR: number
  momentum: number
  roc: number // Rate of Change
}

export interface PriceData {
  close: number
  high: number
  low: number
  volume: number
  date: string
}

export class TechnicalAnalysis {
  static calculateRSI(prices: number[], period = 14): number {
    if (prices.length < period + 1) return 0

    let gains = 0
    let losses = 0

    // Calculate initial average gain and loss
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1]
      if (change > 0) gains += change
      else losses -= change
    }

    let avgGain = gains / period
    let avgLoss = losses / period

    // Calculate RSI using Wilder's smoothing
    for (let i = period + 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1]
      const gain = change > 0 ? change : 0
      const loss = change < 0 ? -change : 0

      avgGain = (avgGain * (period - 1) + gain) / period
      avgLoss = (avgLoss * (period - 1) + loss) / period
    }

    if (avgLoss === 0) return 100
    const rs = avgGain / avgLoss
    return 100 - 100 / (1 + rs)
  }

  static calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return 0
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0)
    return sum / period
  }

  static calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return 0

    const multiplier = 2 / (period + 1)
    let ema = this.calculateSMA(prices.slice(0, period), period)

    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema
    }

    return ema
  }

  static calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12)
    const ema26 = this.calculateEMA(prices, 26)
    const macd = ema12 - ema26

    // Calculate signal line (9-period EMA of MACD)
    const macdValues = []
    for (let i = 26; i <= prices.length; i++) {
      const slice = prices.slice(0, i)
      const ema12 = this.calculateEMA(slice, 12)
      const ema26 = this.calculateEMA(slice, 26)
      macdValues.push(ema12 - ema26)
    }

    const signal = this.calculateEMA(macdValues, 9)
    const histogram = macd - signal

    return { macd, signal, histogram }
  }

  static calculateBollingerBands(
    prices: number[],
    period = 20,
    stdDev = 2,
  ): { upper: number; middle: number; lower: number } {
    const middle = this.calculateSMA(prices, period)
    const slice = prices.slice(-period)
    const variance = slice.reduce((sum, price) => sum + Math.pow(price - middle, 2), 0) / period
    const standardDeviation = Math.sqrt(variance)

    return {
      upper: middle + stdDev * standardDeviation,
      middle,
      lower: middle - stdDev * standardDeviation,
    }
  }

  static calculateStochastic(highs: number[], lows: number[], closes: number[], period = 14): { k: number; d: number } {
    if (highs.length < period) return { k: 0, d: 0 }

    const recentHighs = highs.slice(-period)
    const recentLows = lows.slice(-period)
    const currentClose = closes[closes.length - 1]

    const highestHigh = Math.max(...recentHighs)
    const lowestLow = Math.min(...recentLows)

    const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100

    // Calculate %D (3-period SMA of %K)
    const kValues = []
    for (let i = period - 1; i < closes.length; i++) {
      const sliceHighs = highs.slice(i - period + 1, i + 1)
      const sliceLows = lows.slice(i - period + 1, i + 1)
      const sliceClose = closes[i]

      const high = Math.max(...sliceHighs)
      const low = Math.min(...sliceLows)
      kValues.push(((sliceClose - low) / (high - low)) * 100)
    }

    const d = this.calculateSMA(kValues, 3)

    return { k, d }
  }

  static calculateWilliamsR(highs: number[], lows: number[], closes: number[], period = 14): number {
    if (highs.length < period) return 0

    const recentHighs = highs.slice(-period)
    const recentLows = lows.slice(-period)
    const currentClose = closes[closes.length - 1]

    const highestHigh = Math.max(...recentHighs)
    const lowestLow = Math.min(...recentLows)

    return ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100
  }

  static calculateMomentum(prices: number[], period = 10): number {
    if (prices.length < period + 1) return 0
    return prices[prices.length - 1] - prices[prices.length - 1 - period]
  }

  static calculateROC(prices: number[], period = 12): number {
    if (prices.length < period + 1) return 0
    const current = prices[prices.length - 1]
    const previous = prices[prices.length - 1 - period]
    return ((current - previous) / previous) * 100
  }

  static calculateAllIndicators(priceData: PriceData[]): TechnicalIndicators {
    const closes = priceData.map((d) => d.close)
    const highs = priceData.map((d) => d.high)
    const lows = priceData.map((d) => d.low)

    return {
      rsi: this.calculateRSI(closes),
      macd: this.calculateMACD(closes),
      bollingerBands: this.calculateBollingerBands(closes),
      sma20: this.calculateSMA(closes, 20),
      sma50: this.calculateSMA(closes, 50),
      ema12: this.calculateEMA(closes, 12),
      ema26: this.calculateEMA(closes, 26),
      stochastic: this.calculateStochastic(highs, lows, closes),
      williamsR: this.calculateWilliamsR(highs, lows, closes),
      momentum: this.calculateMomentum(closes),
      roc: this.calculateROC(closes),
    }
  }

  static getSignals(indicators: TechnicalIndicators): {
    rsi: "oversold" | "overbought" | "neutral"
    macd: "bullish" | "bearish" | "neutral"
    stochastic: "oversold" | "overbought" | "neutral"
    williamsR: "oversold" | "overbought" | "neutral"
    trend: "bullish" | "bearish" | "neutral"
  } {
    return {
      rsi: indicators.rsi < 30 ? "oversold" : indicators.rsi > 70 ? "overbought" : "neutral",
      macd: indicators.macd.histogram > 0 ? "bullish" : indicators.macd.histogram < 0 ? "bearish" : "neutral",
      stochastic: indicators.stochastic.k < 20 ? "oversold" : indicators.stochastic.k > 80 ? "overbought" : "neutral",
      williamsR: indicators.williamsR < -80 ? "oversold" : indicators.williamsR > -20 ? "overbought" : "neutral",
      trend:
        indicators.sma20 > indicators.sma50 ? "bullish" : indicators.sma20 < indicators.sma50 ? "bearish" : "neutral",
    }
  }
}
