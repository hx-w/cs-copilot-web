import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google" // Using Inter for a clean, modern look
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "CS2 AI Copilot - Advanced Demo Analysis",
  description: "Elevate your game with AI-driven CS2 demo analysis. Insights, trends, and personalized feedback.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>{children}</body>
    </html>
  )
}
