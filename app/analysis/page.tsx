"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, User, Zap, LineChartIcon, BarChartIcon, PieChartIcon, Cpu, Settings2, Sparkles } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  PieChart,
  Line,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"

const mockDemos = [
  { id: 1, name: "de_dust2_match_001.dem", map: "Dust II", selected: true, date: "2024-01-15" },
  { id: 2, name: "de_mirage_clutch.dem", map: "Mirage", selected: false, date: "2024-01-16" },
  { id: 3, name: "de_inferno_eco.dem", map: "Inferno", selected: true, date: "2024-01-14" },
]

type ChartConfig = {
  xAxisKey?: string
  dataKeys?: { key: string; color: string; name?: string; stackId?: string }[]
  pieDataKey?: string
  pieNameKey?: string
  colors?: string[]
}

type Message = {
  id: number
  type: "user" | "assistant"
  content: string
  timestamp: string
  chartData?: any[]
  chartType?: "line" | "bar" | "pie"
  chartConfig?: ChartConfig
}

const initialMessages: Message[] = [
  {
    id: 1,
    type: "assistant",
    content: "您好！我是您的CS2 AI Copilot。选择Demo文件并告诉我您想分析什么数据。我可以为您生成图表和深度洞察。",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
]

const quickQuestions = [
  { text: "分析我的整体KDA和ADR表现", icon: LineChartIcon },
  { text: "生成各地图表现对比柱状图", icon: BarChartIcon },
  { text: "显示我的武器使用分布饼图", icon: PieChartIcon },
  { text: "分析我的经济管理策略", icon: Zap },
]

const RenderChart = ({
  chartType,
  chartData,
  chartConfig,
}: Pick<Message, "chartType" | "chartData" | "chartConfig">) => {
  if (!chartData || !chartType || !chartConfig) return null
  const chartColors = chartConfig.colors || ["#4A90E2", "#50C878", "#87CEEB", "#98D8C8", "#B0C4DE"]

  return (
    <div className="my-4 h-72 md:h-80 bg-white/60 p-3 rounded-lg border border-white/20 shadow-macos-sm backdrop-blur-sm">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "line" && chartConfig.dataKeys && (
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey={chartConfig.xAxisKey} tick={{ fill: "#666", fontSize: 12 }} />
            <YAxis tick={{ fill: "#666", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "14px",
              }}
              labelStyle={{ color: "#333", fontWeight: "600" }}
            />
            <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }} />
            {chartConfig.dataKeys.map((dk) => (
              <Line
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                name={dk.name || dk.key}
                stroke={dk.color}
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: dk.color }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        )}
        {chartType === "bar" && chartConfig.dataKeys && (
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey={chartConfig.xAxisKey} tick={{ fill: "#666", fontSize: 12 }} />
            <YAxis tick={{ fill: "#666", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "14px",
              }}
              labelStyle={{ color: "#333", fontWeight: "600" }}
            />
            <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }} />
            {chartConfig.dataKeys.map((dk) => (
              <Bar
                key={dk.key}
                dataKey={dk.key}
                name={dk.name || dk.key}
                fill={dk.color}
                stackId={dk.stackId}
                radius={[3, 3, 0, 0]}
                barSize={22}
              />
            ))}
          </BarChart>
        )}
        {chartType === "pie" && chartConfig.pieDataKey && chartConfig.pieNameKey && (
          <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={90}
              fill="#4A90E2"
              dataKey={chartConfig.pieDataKey}
              nameKey={chartConfig.pieNameKey}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                  className="focus:outline-none hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "14px",
              }}
              labelStyle={{ color: "#333", fontWeight: "600" }}
              formatter={(value, name, props) => [
                `${props.payload[chartConfig.pieDataKey!]} (${(props.payload.percent * 100).toFixed(1)}%)`,
                name,
              ]}
            />
            <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export default function AnalysisPage() {
  const [selectedDemos, setSelectedDemos] = useState(mockDemos.filter((d) => d.selected).map((d) => d.id))
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleDemoToggle = (demoId: number) => {
    setSelectedDemos((prev) => (prev.includes(demoId) ? prev.filter((id) => id !== demoId) : [...prev, demoId]))
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || selectedDemos.length === 0) return
    const userMsg: Message = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMsg])
    const currentInput = inputMessage
    setInputMessage("")
    setIsLoading(true)

    setTimeout(() => {
      const selectedDemoNames =
        mockDemos
          .filter((d) => selectedDemos.includes(d.id))
          .map((d) => d.name)
          .join(", ") || "已选Demo"
      let aiResponseContent = `基于您在 ${selectedDemoNames} 中的数据分析：\n\n关于 "${currentInput}"，我发现了以下关键洞察：`
      let chartData: any[] | undefined,
        chartType: Message["chartType"] | undefined,
        chartConfig: ChartConfig | undefined

      if (currentInput.toLowerCase().includes("武器") && currentInput.toLowerCase().includes("饼图")) {
        aiResponseContent = `${aiResponseContent}\n\n📊 **武器使用分布分析**\n\n从饼图可以看出，AK-47是您最常用的武器，占总击杀的40%。M4A4和AWP分别占25%和15%。\n\n**建议**：\n• 继续保持步枪的熟练度\n• 可以尝试增加冲锋枪的使用以应对特定局势\n• AWP使用率适中，建议在经济允许时多练习`
        chartType = "pie"
        chartData = [
          { name: "AK-47", kills: 40, percent: 0.4 },
          { name: "M4A4", kills: 25, percent: 0.25 },
          { name: "AWP", kills: 15, percent: 0.15 },
          { name: "USP-S", kills: 10, percent: 0.1 },
          { name: "Glock-18", kills: 5, percent: 0.05 },
          { name: "其他", kills: 5, percent: 0.05 },
        ]
        chartConfig = {
          pieDataKey: "kills",
          pieNameKey: "name",
          colors: ["#4A90E2", "#50C878", "#87CEEB", "#98D8C8", "#B0C4DE", "#DDA0DD"],
        }
      } else if (currentInput.toLowerCase().includes("地图") && currentInput.toLowerCase().includes("表现")) {
        aiResponseContent = `${aiResponseContent}\n\n📊 **各地图表现对比分析**\n\n从柱状图可以看出：\n• **Mirage**: ADR最高(95)，表现最佳\n• **Dust II**: ADR为85，表现稳定\n• **Inferno**: ADR为82，略有提升空间\n• **Overpass**: ADR较低(70)，需要重点练习\n\n**建议**：\n• 分析Mirage上的成功策略，应用到其他地图\n• 针对Overpass制定专门的练习计划`
        chartType = "bar"
        chartData = [
          { map: "Dust II", adr: 85 },
          { map: "Mirage", adr: 95 },
          { map: "Inferno", adr: 82 },
          { map: "Overpass", adr: 70 },
          { map: "Nuke", adr: 78 },
        ]
        chartConfig = { xAxisKey: "map", dataKeys: [{ key: "adr", color: "#4A90E2", name: "平均ADR" }] }
      } else if (currentInput.toLowerCase().includes("kda")) {
        aiResponseContent = `${aiResponseContent}\n\n📊 **KDA趋势分析**\n\n从趋势图可以看出：\n• 击杀数在第5回合和第12回合达到峰值\n• 死亡数相对稳定，控制良好\n• ADR波动较大，建议保持稳定输出\n\n**关键发现**：\n• 您在关键回合表现出色\n• 生存能力较强，死亡控制得当\n• 建议提高持续输出稳定性`
        chartType = "line"
        chartData = [
          { round: 1, kills: 1, deaths: 0, adr: 85 },
          { round: 2, kills: 0, deaths: 1, adr: 45 },
          { round: 3, kills: 2, deaths: 1, adr: 95 },
          { round: 4, kills: 1, deaths: 0, adr: 110 },
          { round: 5, kills: 3, deaths: 0, adr: 130 },
          { round: 6, kills: 0, deaths: 1, adr: 25 },
          { round: 7, kills: 1, deaths: 1, adr: 75 },
          { round: 8, kills: 2, deaths: 0, adr: 105 },
        ]
        chartConfig = {
          xAxisKey: "round",
          dataKeys: [
            { key: "kills", color: "#4A90E2", name: "击杀" },
            { key: "deaths", color: "#50C878", name: "死亡" },
            { key: "adr", color: "#87CEEB", name: "ADR" },
          ],
        }
      } else {
        aiResponseContent += `\n\n• **数据点1**: 基于您的游戏风格分析...\n• **数据点2**: 与同水平玩家对比...\n• **趋势分析**: 近期表现呈上升趋势\n\n您希望我生成特定的图表来可视化这些数据吗？例如柱状图、折线图或饼图？`
      }

      const aiMsg: Message = {
        id: Date.now() + 1,
        type: "assistant",
        content: aiResponseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        chartData,
        chartType,
        chartConfig,
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsLoading(false)
    }, 2000)
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
  }

  return (
    <div className="min-h-screen flex chat-gradient-bg">
      <Sidebar />
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out flex flex-col",
          sidebarCollapsed ? "ml-[72px]" : "ml-60",
        )}
      >
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-macos-sm z-10">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center text-foreground">
              AI Copilot <Sparkles className="w-8 h-8 ml-3 text-primary" />
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">与AI助手深度对话，获取专业的游戏数据洞察</p>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-80 bg-white/70 backdrop-blur-sm border-r border-white/20 flex-shrink-0 overflow-y-auto shadow-macos-sm">
            <div className="p-6 space-y-6">
              <Card className="shadow-macos-sm bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Settings2 className="w-5 h-5 text-primary" /> Demo 选择
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[240px] overflow-y-auto">
                  {mockDemos.map((demo) => (
                    <div
                      key={demo.id}
                      className="flex items-start space-x-3 p-3 hover:bg-white/60 rounded-md transition-colors"
                    >
                      <Checkbox
                        id={`demo-${demo.id}`}
                        checked={selectedDemos.includes(demo.id)}
                        onCheckedChange={() => handleDemoToggle(demo.id)}
                        className="border-primary/60 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={`demo-${demo.id}`}
                          className="text-sm font-medium leading-none cursor-pointer text-foreground block"
                        >
                          {demo.name}
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {demo.map} • {demo.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardContent className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground">已选择 {selectedDemos.length} 个Demo文件</p>
                </CardContent>
              </Card>

              <Card className="shadow-macos-sm bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Zap className="w-5 h-5 text-primary" /> 快速提问
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quickQuestions.map((q, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-3 px-3 hover:bg-white/60 hover:text-primary group text-sm"
                      onClick={() => handleQuickQuestion(q.text)}
                    >
                      <q.icon className="w-4 h-4 mr-3 text-primary/80 group-hover:text-primary transition-colors shrink-0" />
                      <span>{q.text}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto chat-gradient-bg" ref={scrollAreaRef}>
              <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex gap-4", message.type === "user" ? "justify-end" : "justify-start")}
                  >
                    {message.type === "assistant" && (
                      <Avatar className="w-10 h-10 self-start border-2 border-primary/20 shadow-macos-sm">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Cpu className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-5 py-4 shadow-macos-md backdrop-blur-sm",
                        message.type === "user"
                          ? "bg-primary text-primary-foreground rounded-br-lg"
                          : "bg-white/80 text-card-foreground border border-white/20 rounded-bl-lg",
                      )}
                    >
                      <div className="whitespace-pre-wrap text-base leading-relaxed">{message.content}</div>
                      {message.chartData && (
                        <RenderChart
                          chartType={message.chartType}
                          chartData={message.chartData}
                          chartConfig={message.chartConfig}
                        />
                      )}
                      <div
                        className={cn("text-sm opacity-60 mt-3", message.type === "user" ? "text-right" : "text-left")}
                      >
                        {message.timestamp}
                      </div>
                    </div>
                    {message.type === "user" && (
                      <Avatar className="w-10 h-10 self-start border-2 border-white/20 shadow-macos-sm">
                        <AvatarFallback className="bg-white/80 text-muted-foreground">
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 justify-start">
                    <Avatar className="w-10 h-10 self-start border-2 border-primary/20 shadow-macos-sm">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Cpu className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white/80 text-card-foreground border border-white/20 rounded-2xl rounded-bl-lg px-5 py-4 shadow-macos-md backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex space-x-1">
                          <span className="h-2 w-2 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="h-2 w-2 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="h-2 w-2 bg-primary/70 rounded-full animate-bounce"></span>
                        </div>
                        <span className="text-base text-muted-foreground">AI正在深度分析您的数据...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-white/20 bg-white/70 backdrop-blur-sm shadow-macos-sm">
              <div className="max-w-4xl mx-auto px-6 py-5">
                <div className="flex items-center gap-4">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={selectedDemos.length > 0 ? "向AI提问关于您的游戏数据..." : "请先选择要分析的Demo文件"}
                    onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                    disabled={isLoading || selectedDemos.length === 0}
                    className="flex-1 h-16 text-base rounded-full px-5 focus-visible:ring-primary/70 focus-visible:ring-offset-0 focus-visible:ring-2 shadow-macos-sm border-white/30 bg-white/80"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim() || selectedDemos.length === 0}
                    className="h-16 w-16 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity shrink-0 shadow-macos-md"
                  >
                    <Send className="w-6 h-6" />
                    <span className="sr-only">发送消息</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  AI可以根据您的问题动态生成图表和深度分析。尝试询问具体的数据问题。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
