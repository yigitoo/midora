import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "TRY" ? "TRY" : "USD",
    minimumFractionDigits: 2,
  }).format(price)
}

export function formatNumber(num: number | undefined, suffix = ""): string {
  if (num === undefined || num === null) return "N/A"
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T${suffix}`
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B${suffix}`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M${suffix}`
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K${suffix}`
  return `${num.toFixed(2)}${suffix}`
}

export function formatPercent(num: number | undefined): string {
  if (num === undefined || num === null) return "N/A"
  return `${(num * 100).toFixed(2)}%`
}
