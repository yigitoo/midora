"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  BarChart3,
  Search,
  Wallet,
  MessageSquare,
  User,
  Home,
  Newspaper,
  Settings,
  LogOut,
  DollarSign,
  Globe,
} from "lucide-react"

const navigation = [
  {
    title: "Overview",
    items: [
      { name: "Home", href: "/", icon: Home },
      { name: "Dashboard", href: "/dashboard", icon: BarChart3, requireAuth: true },
    ],
  },
  {
    title: "Markets",
    items: [
      { name: "All Markets", href: "/markets", icon: TrendingUp },
      { name: "NYSE", href: "/markets?exchange=nyse", icon: DollarSign },
      { name: "NASDAQ", href: "/markets?exchange=nasdaq", icon: BarChart3 },
      { name: "BIST", href: "/markets?exchange=bist", icon: Globe },
    ],
  },
  {
    title: "Tools",
    items: [
      { name: "Screener", href: "/screener", icon: Search },
      { name: "Watchlist", href: "/watchlist", icon: Wallet, requireAuth: true },
      { name: "Portfolio", href: "/portfolio", icon: BarChart3, requireAuth: true },
    ],
  },
  {
    title: "Community",
    items: [
      { name: "Forum", href: "/forum", icon: MessageSquare },
      { name: "News", href: "/news", icon: Newspaper },
    ],
  },
  {
    title: "Account",
    items: [
      { name: "About", href: "/about", icon: User },
      { name: "Settings", href: "/settings", icon: Settings, requireAuth: true },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-data-[collapsible=icon]:hidden">
            Midora
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  if (item.requireAuth && !user) return null
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                          {item.name === "Watchlist" && user && (
                            <Badge variant="secondary" className="ml-auto">
                              5
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {user ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-2 px-2 py-1">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium">
                    {user.user_metadata?.full_name || user.email?.split("@")[0]}
                  </span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/auth/login">
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
