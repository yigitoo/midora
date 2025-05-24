import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"
import { Stats } from "@/components/sections/stats"
import { CTA } from "@/components/sections/cta"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen rounded-2xl">
      <Hero />
      <Features />
      <Stats />
      <CTA />
    </div>
  )
}
