"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  Legend,
} from "recharts"
import { Target, Users, Play, MapIcon as MapIconLucide, DollarSign, ArrowRight } from "lucide-react" // Renamed MapIcon to MapIconLucide
import { Sidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"
import { useState } from "react"

// Mock data remains the same as previous version
const templates = [
  {
    id: 1,
    title: "个人表现分析",
    description: "全面分析个人KD、ADR、命中率、经济贡献等核心数据。",
    category: "个人分析",
    icon: Target,
    color: "from-blue-500 to-blue-400",
    charts: ["击杀死亡比", "伤害输出", "武器精度", "能力雷达图", "ADR vs. 爆头率"],
    popular: true,
  },
  {
    id: 2,
    title: "团队协作分析",
    description: "分析团队配合、经济管理、战术执行和整体经济趋势。",
    category: "团队分析",
    icon: Users,
    color: "from-green-500 to-green-400",
    charts: ["团队经济趋势", "配合效率", "战术成功率", "资源分配"],
    popular: false,
  },
  {
    id: 3,
    title: "地图策略分析",
    description: "深度分析地图控制、位置优势、移动路线和各图表现对比。",
    category: "战术分析",
    icon: MapIconLucide,
    color: "from-purple-500 to-purple-400",
    charts: ["区域控制热力图", "移动路线", "位置胜率", "KDA分地图对比"],
    popular: true,
  },
  {
    id: 4,
    title: "武器与经济效率",
    description: "分析不同武器的使用效率、购买决策和经济影响力。",
    category: "装备与经济",
    icon: DollarSign,
    color: "from-orange-500 to-orange-400",
    charts: ["武器伤害占比", "购买效率", "经济回报率", "首杀武器统计"],
    popular: false,
  },
]

const sampleData = {
  performance: [
    { round: 1, kills: 2, deaths: 1, adr: 85 },
    { round: 2, kills: 1, deaths: 2, adr: 45 },
    { round: 3, kills: 3, deaths: 0, adr: 120 },
    { round: 4, kills: 0, deaths: 1, adr: 25 },
    { round: 5, kills: 2, deaths: 1, adr: 95 },
  ],
  radar: [
    { subject: "瞄准", A: 120, fullMark: 150 },
    { subject: "定位", A: 98, fullMark: 150 },
    { subject: "经济", A: 86, fullMark: 150 },
    { subject: "配合", A: 99, fullMark: 150 },
    { subject: "决策", A: 85, fullMark: 150 },
    { subject: "反应", A: 65, fullMark: 150 },
  ],
  kdaPerMap: [
    { map: "Dust II", k: 18, d: 10, a: 5 },
    { map: "Mirage", k: 22, d: 15, a: 3 },
    { map: "Inferno", k: 15, d: 12, a: 8 },
    { map: "Overpass", k: 20, d: 9, a: 6 },
    { map: "Nuke", k: 12, d: 14, a: 7 },
  ],
  adrVsHs: [
    { adr: 75.2, hs: 20.1, rounds: 22 },
    { adr: 85.5, hs: 25.3, rounds: 28 },
    { adr: 60.1, hs: 15.9, rounds: 19 },
    { adr: 95.8, hs: 30.5, rounds: 25 },
    { adr: 70.3, hs: 18.2, rounds: 30 },
    { adr: 102.1, hs: 28.7, rounds: 26 },
    { adr: 65.9, hs: 22.0, rounds: 23 },
  ],
  economyTrend: [
    { round: 1, teamA_eco: 800, teamB_eco: 800 },
    { round: 2, teamA_eco: 4750, teamB_eco: 3200 },
    { round: 3, teamA_eco: 5200, teamB_eco: 6800 },
    { round: 4, teamA_eco: 12000, teamB_eco: 9500 },
    { round: 5, teamA_eco: 15500, teamB_eco: 13000 },
    { round: 6, teamA_eco: 21000, teamB_eco: 18500 },
    { round: 7, teamA_eco: 19500, teamB_eco: 22000 },
  ],
}

export default function TemplatesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const chartComponents = [
    {
      title: "回合表现趋势 (折线图)",
      description: "击杀、死亡和ADR数据变化",
      Chart: LineChart,
      data: sampleData.performance,
      config: {
        type: "line",
        xKey: "round",
        lines: [
          { key: "kills", stroke: "hsl(var(--primary))", name: "击杀" },
          { key: "adr", stroke: "hsl(var(--accent))", name: "ADR" },
        ],
      },
    },
    {
      title: "能力雷达图",
      description: "综合能力评估",
      Chart: RadarChart,
      data: sampleData.radar,
      config: {
        type: "radar",
        angleKey: "subject",
        radarKey: "A",
        name: "能力值",
        stroke: "hsl(var(--primary))",
        fill: "hsl(var(--primary))",
      },
    },
    {
      title: "KDA 各地图对比 (柱状图)",
      description: "不同地图上的击杀、死亡、助攻表现",
      Chart: BarChart,
      data: sampleData.kdaPerMap,
      config: {
        type: "bar",
        xKey: "map",
        bars: [
          { key: "k", fill: "hsl(var(--primary))", name: "击杀" },
          { key: "d", fill: "hsl(var(--accent))", name: "死亡" },
          { key: "a", fill: "hsl(var(--primary)/0.6)", name: "助攻" },
        ],
      },
    },
    {
      title: "ADR vs. 爆头率 (散点图)",
      description: "平均每回合伤害与爆头率的关联性",
      Chart: ScatterChart,
      data: sampleData.adrVsHs,
      config: { type: "scatter", xKey: "adr", yKey: "hs", name: "玩家表现", fill: "hsl(var(--accent))" },
    },
    {
      title: "团队经济趋势 (面积图)",
      description: "双方队伍经济随回合变化情况",
      Chart: AreaChart,
      data: sampleData.economyTrend,
      config: {
        type: "area",
        xKey: "round",
        areas: [
          { key: "teamA_eco", stroke: "hsl(var(--primary))", fill: "hsl(var(--primary))", name: "队伍A经济" },
          { key: "teamB_eco", stroke: "hsl(var(--accent))", fill: "hsl(var(--accent))", name: "队伍B经济" },
        ],
      },
    },
  ]

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main
        className={cn(
          "flex-1 p-6 md:p-8 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "ml-20" : "ml-64",
        )}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">分析模板</h1>
              <p className="text-muted-foreground mt-1 text-lg">选择预设的分析模板，快速获得专业洞察和可视化图表。</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {templates.map((template) => {
              const IconComponent = template.icon
              return (
                <Card
                  key={template.id}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden futuristic-border"
                >
                  {template.popular && (
                    <Badge className="absolute top-4 right-4 z-10 bg-accent text-accent-foreground border-none">
                      热门
                    </Badge>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br",
                          template.color,
                          "group-hover:scale-105 transition-transform",
                        )}
                      >
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{template.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CardDescription className="text-sm leading-relaxed min-h-[40px]">
                      {template.description}
                    </CardDescription>
                    <div>
                      <h4 className="font-medium text-xs text-muted-foreground mb-1.5">包含图表与分析点：</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {template.charts.map((chart, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs border-primary/30 text-primary/80 bg-primary/5"
                          >
                            {chart}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button className="w-full tech-glow-sm group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all">
                      <Play className="w-4 h-4 mr-2" />
                      使用此模板分析
                      <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          <div className="space-y-6 pt-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">模板图表示例</h2>
              <p className="text-muted-foreground text-base">
                以下是分析模板可能生成的各类示例图表，展示了数据的多种可视化方式。
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {chartComponents.map(({ title, description, Chart, data, config }, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <Chart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
                        {" "}
                        {/* Adjusted margins slightly */}
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.6)" />
                        {/* Conditional XAxis rendering for Cartesian charts */}
                        {["line", "bar", "scatter", "area"].includes(config.type) && (
                          <XAxis
                            type={config.type === "scatter" ? "number" : undefined}
                            dataKey={config.xKey}
                            name={config.xKey} // For tooltip reference
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                            domain={config.type === "scatter" ? ["dataMin - 5", "dataMax + 5"] : undefined} // Example domain for scatter
                          />
                        )}
                        {/* Conditional YAxis rendering for Cartesian charts */}
                        {["line", "bar", "scatter", "area"].includes(config.type) && (
                          <YAxis
                            type={config.type === "scatter" ? "number" : undefined}
                            dataKey={config.type === "scatter" ? config.yKey : undefined} // Scatter YAxis needs dataKey
                            name={config.type === "scatter" ? config.yKey : undefined} // For tooltip reference
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                            domain={config.type === "scatter" ? ["dataMin - 5", "dataMax + 5"] : undefined} // Example domain for scatter
                          />
                        )}
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                          }}
                          labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "600" }}
                          itemStyle={{ fontSize: "12px" }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                        {config.type === "line" &&
                          config.lines?.map((line) => (
                            <Line
                              key={line.key}
                              type="monotone"
                              dataKey={line.key}
                              name={line.name}
                              stroke={line.stroke}
                              strokeWidth={2}
                              dot={{ r: 3, fill: line.stroke }}
                              activeDot={{ r: 5 }}
                            />
                          ))}
                        {config.type === "bar" &&
                          config.bars?.map((bar) => (
                            <Bar
                              key={bar.key}
                              dataKey={bar.key}
                              name={bar.name}
                              fill={bar.fill}
                              radius={[3, 3, 0, 0]}
                              barSize={config.bars && config.bars.length > 1 ? undefined : 20} // Adjust barSize if multiple bars
                            />
                          ))}
                        {config.type === "scatter" && (
                          // Scatter component relies on XAxis and YAxis dataKeys.
                          // It does not take dataKey for y-values directly.
                          <Scatter name={config.name} fill={config.fill} />
                        )}
                        {config.type === "area" &&
                          config.areas?.map((area) => (
                            <Area
                              key={area.key}
                              type="monotone"
                              dataKey={area.key}
                              name={area.name}
                              stroke={area.stroke}
                              fill={area.fill}
                              fillOpacity={0.5} // Slightly adjusted opacity
                              stackId={config.areas && config.areas.length > 1 ? "1" : undefined} // Apply stackId only if multiple areas
                            />
                          ))}
                        {/* Specific components for RadarChart */}
                        {config.type === "radar" && (
                          <>
                            <PolarGrid stroke="hsl(var(--border) / 0.6)" />
                            <PolarAngleAxis
                              dataKey={config.angleKey}
                              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                            />
                            <PolarRadiusAxis
                              angle={30}
                              domain={[0, 150]} // Assuming fullMark is 150, adjust if dynamic
                              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                            />
                            <Radar
                              name={config.name}
                              dataKey={config.radarKey}
                              stroke={config.stroke}
                              fill={config.fill}
                              fillOpacity={0.6}
                            />
                          </>
                        )}
                      </Chart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
