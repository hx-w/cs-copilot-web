"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Upload,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Cpu,
} from "lucide-react"

const navigation = [
  { name: "首页", href: "/", icon: LayoutDashboard },
  { name: "Demo管理", href: "/demos", icon: Upload },
  { name: "AI Copilot", href: "/analysis", icon: MessageSquare },
  { name: "分析模板", href: "/templates", icon: BarChart3 },
]

const bottomNavigation = [{ name: "设置", href: "/settings", icon: Settings }]

type SidebarProps = {
  onCollapseChange?: (collapsed: boolean) => void
}

export function Sidebar({ onCollapseChange }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const handleCollapse = () => {
    const newCollapsedState = !collapsed
    setCollapsed(newCollapsedState)
    onCollapseChange?.(newCollapsedState)
  }

  return (
    <aside
      className={cn(
        "relative z-40 h-screen flex flex-col bg-card border-r transition-all duration-300 ease-in-out shadow-macos-md flex-shrink-0",
        collapsed ? "w-[72px]" : "w-60",
      )}
    >
      <div className={cn("flex h-[72px] items-center border-b px-4", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2.5 bg-primary rounded-lg group-hover:opacity-90 transition-opacity shadow-sm">
              <Cpu className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">CS2 Copilot</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="flex items-center justify-center w-full group">
            <div className="p-2.5 bg-primary rounded-lg group-hover:opacity-90 transition-opacity shadow-sm">
              <Cpu className="w-6 h-6 text-primary-foreground" />
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCollapse}
          className={cn(
            "h-7 w-7 absolute right-0 top-1/2 -translate-y-1/2 bg-card border rounded-full shadow-macos-sm hover:bg-muted",
            collapsed ? "translate-x-[calc(50%_-_1px)]" : "translate-x-1/2",
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1.5 p-2.5">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-150 ease-in-out",
                "hover:text-primary hover:bg-secondary",
                isActive && "bg-primary text-primary-foreground shadow-sm",
                collapsed && "justify-center aspect-square h-11 w-11 p-0",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary",
                )}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
              {collapsed && <span className="sr-only">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t p-2.5 space-y-1.5">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-150 ease-in-out",
                "hover:text-primary hover:bg-secondary",
                isActive && "bg-primary text-primary-foreground shadow-sm",
                collapsed && "justify-center aspect-square h-11 w-11 p-0",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary",
                )}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
              {collapsed && <span className="sr-only">{item.name}</span>}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
