"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
} from "recharts"
import { Upload, MessageSquare, Clock, BarChartHorizontalBig, ArrowRight, TrendingUp, Sparkles } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"

const recentAnalysis = [
  { id: 1, name: "de_dust2_vs_TeamX.dem", status: "completed", analysisType: "Team Performance", date: "2024-01-15" },
  {
    id: 2,
    name: "de_mirage_clutch_focus.dem",
    status: "analyzing",
    analysisType: "Individual Clutch",
    date: "2024-01-15",
  },
  {
    id: 3,
    name: "inferno_economy_study.dem",
    status: "completed",
    analysisType: "Economy Strategy",
    date: "2024-01-14",
  },
]

// Sample chart data for hero section
const performanceData = [
  { round: 1, kills: 2, deaths: 1, adr: 85 },
  { round: 2, kills: 1, deaths: 2, adr: 45 },
  { round: 3, kills: 3, deaths: 0, adr: 120 },
  { round: 4, kills: 0, deaths: 1, adr: 25 },
  { round: 5, kills: 2, deaths: 1, adr: 95 },
  { round: 6, kills: 1, deaths: 0, adr: 110 },
]

const weaponData = [
  { name: "AK-47", value: 35, color: "#4A90E2" },
  { name: "M4A4", value: 28, color: "#50C878" },
  { name: "AWP", value: 20, color: "#87CEEB" },
  { name: "Glock", value: 10, color: "#98D8C8" },
  { name: "USP-S", value: 7, color: "#B0C4DE" },
]

const mapPerformance = [
  { map: "Dust II", winRate: 68, avgKills: 18 },
  { map: "Mirage", winRate: 75, avgKills: 22 },
  { map: "Inferno", winRate: 62, avgKills: 15 },
  { map: "Overpass", winRate: 58, avgKills: 20 },
]

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out overflow-y-auto",
          sidebarCollapsed ? "ml-[72px]" : "ml-60",
        )}
      >
        {/* Hero Banner - Redesigned */}
        <div className="relative overflow-hidden bg-background">
          <div className="absolute inset-0 hero-gradient-bg"></div>
          {/* Aurora-style background */}
          <div className="absolute inset-0 opacity-50">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle cx={512} cy={512} r={512} fill="url(#gradient-aurora)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="gradient-aurora">
                  <stop stopColor="hsl(var(--primary) / 0.8)" />
                  <stop offset={1} stopColor="hsl(var(--accent) / 0.6)" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          <div
            className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32 lg:py-40"
            style={{
              maskImage: "linear-gradient(to bottom, white 80%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, white 80%, transparent 100%)",
            }}
          >
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white text-shadow-lg">
                你的专属CS分析师
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed text-shadow">
                基于AI驱动的深度数据分析，助您精进技艺，洞察战术，成就电竞梦想
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  size="lg"
                  className="bg-white/90 text-primary hover:bg-white font-bold px-8 py-3 text-lg shadow-macos-lg backdrop-blur-sm border border-white/20"
                  asChild
                >
                  <Link href="/demos">
                    <Upload className="w-5 h-5 mr-2.5" />
                    上传Demo开始分析
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 hover:text-white font-semibold px-8 py-3 text-lg bg-white/5 backdrop-blur-sm shadow-macos-lg"
                  asChild
                >
                  <Link href="/analysis">
                    <MessageSquare className="w-5 h-5 mr-2.5" />
                    与AI对话
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Charts Section - More Compact */}
        <div className="bg-background py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2">数据驱动的深度洞察</h2>
              <p className="text-base text-muted-foreground max-w-xl mx-auto">
                通过AI分析您的游戏数据，发现隐藏的模式和提升机会
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              {/* Performance Trend Chart */}
              <Card className="lg:col-span-2 shadow-macos-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    表现趋势分析
                  </CardTitle>
                  <CardDescription className="text-sm">实时追踪您的击杀、死亡和ADR数据变化</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={performanceData} margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.6)" />
                      <XAxis dataKey="round" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                          boxShadow: "var(--shadow-macos-sm)",
                          fontSize: "12px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "500" }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Line
                        type="monotone"
                        dataKey="kills"
                        stroke="#4A90E2"
                        strokeWidth={2.5}
                        name="击杀"
                        dot={{ r: 3, fill: "#4A90E2" }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="adr"
                        stroke="#50C878"
                        strokeWidth={2.5}
                        name="ADR"
                        dot={{ r: 3, fill: "#50C878" }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Weapon Distribution */}
              <Card className="shadow-macos-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">武器使用分布</CardTitle>
                  <CardDescription className="text-sm">分析您的武器偏好和效率</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={weaponData}
                        cx="50%"
                        cy="50%"
                        outerRadius={85}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                      >
                        {weaponData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            className="focus:outline-none hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                          boxShadow: "var(--shadow-macos-sm)",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Map Performance Chart */}
            <Card className="shadow-macos-md mb-10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">地图表现对比</CardTitle>
                <CardDescription className="text-sm">各地图胜率和平均击杀数据分析</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={mapPerformance} margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.6)" />
                    <XAxis dataKey="map" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "var(--shadow-macos-sm)",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="winRate" fill="#4A90E2" name="胜率 %" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="avgKills" fill="#50C878" name="平均击杀" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Below - More Compact */}
        <div className="bg-muted/30 py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-8">
            {/* Recent Analysis & Quick Actions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Analysis */}
              <div className="lg:col-span-2">
                <Card className="shadow-macos-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      最近分析任务
                    </CardTitle>
                    <CardDescription className="text-sm">查看您最新的Demo分析进度和结果</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {recentAnalysis.map((demo) => (
                      <div
                        key={demo.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg hover:bg-secondary/60 transition-colors"
                      >
                        <div className="flex-1 mb-2 sm:mb-0">
                          <h4 className="font-medium text-sm text-foreground">{demo.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {demo.date} - <span className="text-primary/90">{demo.analysisType}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-center">
                          {demo.status === "completed" ? (
                            <Badge
                              variant="outline"
                              className="border-green-500/40 text-green-600 bg-green-500/10 text-xs py-0.5 px-1.5"
                            >
                              已完成
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-blue-500/40 text-blue-600 bg-blue-500/10 text-xs py-0.5 px-1.5 animate-pulse"
                            >
                              分析中
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="text-primary hover:text-primary hover:bg-primary/10 h-7 px-2 text-xs"
                          >
                            <Link href={`/analysis?demo_id=${demo.id}`}>
                              查看 <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full mt-3 text-primary border-primary/30 hover:bg-primary/10 hover:text-primary py-2 text-sm"
                    >
                      查看所有分析 <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card className="shadow-macos-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-foreground">快速操作</CardTitle>
                    <CardDescription className="text-sm">开始您的分析之旅</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="default"
                      className="w-full justify-start text-sm py-3 bg-primary text-primary-foreground hover:bg-primary/90"
                      asChild
                    >
                      <Link href="/demos">
                        <Upload className="w-4 h-4 mr-2" /> 上传新Demo
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm py-3 text-primary border-primary/30 hover:bg-primary/10 hover:text-primary"
                      asChild
                    >
                      <Link href="/analysis">
                        <MessageSquare className="w-4 h-4 mr-2" /> AI Copilot 分析
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm py-3 text-primary border-primary/30 hover:bg-primary/10 hover:text-primary"
                      asChild
                    >
                      <Link href="/templates">
                        <BarChartHorizontalBig className="w-4 h-4 mr-2" /> 分析模板
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Tips Card */}
                <Card className="shadow-macos-md mt-4 primary-gradient-bg text-primary-foreground">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> AI 分析建议
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-xs space-y-1.5 opacity-90">
                      <li>• 上传多场比赛获得更准确的分析</li>
                      <li>• 尝试询问AI关于特定地图的表现</li>
                      <li>• 使用模板快速生成专业报告</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
