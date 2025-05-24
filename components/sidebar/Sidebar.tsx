"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  TrendingUp,
  BarChart3,
  Users,
  Info,
  ChevronLeft,
  ChevronRight,
  Search,
  Newspaper,
  PieChart,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const navigation = [
    {
      title: "Main",
      items: [
        { name: "Home", href: "/", icon: Home },
        { name: "Search Stocks", href: "/stocks/search", icon: Search },
        { name: "All Stocks", href: "/stocks", icon: BarChart3 },
      ],
    },
    {
      title: "Market",
      items: [
        { name: "Top Gainers", href: "/stocks?filter=gainers", icon: TrendingUp },
        { name: "Market News", href: "/news", icon: Newspaper },
        { name: "Portfolios", href: "/portfolios", icon: PieChart },
      ],
    },
    {
      title: "Community",
      items: [
        { name: "Forum", href: "/forum", icon: Users },
        { name: "About", href: "/about", icon: Info },
      ],
    },
  ]

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background p-0"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      {/* Sidebar Content */}
      <ScrollArea className="flex-1 px-3 py-6">
        <div className="space-y-6">
          {navigation.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          isCollapsed ? "px-2" : "px-3",
                          isActive && "bg-primary/10 text-primary",
                        )}
                        size="sm"
                      >
                        <Icon className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                        {!isCollapsed && <span>{item.name}</span>}
                      </Button>
                    </Link>
                  )
                })}
              </div>
              {!isCollapsed && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      {!isCollapsed && (
        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground text-center">
            © 2024 Midora
            <br />
            Stock Market Platform
          </p>
        </div>
      )}
    </div>
  )
}
