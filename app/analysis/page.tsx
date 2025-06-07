"use client"

import { useEffect, useRef, useState } from "react"
import { useChat, type Message } from "ai/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, User, Zap, LineChartIcon, BarChartIcon, PieChartIcon, Cpu, Settings2, Sparkles } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"

const mockDemos = [
  { id: 1, name: "de_dust2_match_001.dem", map: "Dust II", selected: true, date: "2024-01-15" },
  { id: 2, name: "de_mirage_clutch.dem", map: "Mirage", selected: false, date: "2024-01-16" },
  { id: 3, name: "de_inferno_eco.dem", map: "Inferno", selected: true, date: "2024-01-14" },
]

const quickQuestions = [
  { text: "分析我的整体KDA和ADR表现", icon: LineChartIcon },
  { text: "生成各地图表现对比柱状图", icon: BarChartIcon },
  { text: "显示我的武器使用分布饼图", icon: PieChartIcon },
  { text: "分析我的经济管理策略", icon: Zap },
]

export default function AnalysisPage() {
  const [selectedDemos, setSelectedDemos] = useState(mockDemos.filter((d) => d.selected).map((d) => d.id))
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "您好！我是您的CS2 AI Copilot。告诉我您想分析什么数据。",
      },
    ],
    maxSteps: 5,
    onError: (error) => {
      console.error("Chat error:", error);
    },
  })
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleDemoToggle = (demoId: number) => {
    setSelectedDemos((prev) => (prev.includes(demoId) ? prev.filter((id) => id !== demoId) : [...prev, demoId]))
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-macos-sm z-10 flex-shrink-0">
          <div className="px-6 py-6">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center text-foreground">
              AI Copilot <Sparkles className="w-8 h-8 ml-3 text-primary" />
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">与AI助手深度对话，获取专业的游戏数据洞察</p>
          </div>
        </header>

        <div className="flex-1 flex overflow-y-auto">
          {/* Left Panel */}
          <aside className="w-80 bg-white/70 backdrop-blur-sm border-r border-white/20 flex-shrink-0 overflow-y-auto shadow-macos-sm hidden md:block">
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
          </aside>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Messages */}
            <div className="flex-1 chat-gradient-bg" ref={scrollAreaRef}>
              <div className="px-6 py-8 space-y-6">
                {messages.map((message: Message) => (
                  <ChatMessage key={message.id} message={message} allMessages={messages} />
                ))}
                {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
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
            <div className="border-t border-primary/10 bg-white/90 backdrop-blur-xl shadow-lg flex-shrink-0">
              <form onSubmit={handleSubmit} className="p-4 max-w-4xl mx-auto">
                <div className="relative">
                  <Textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder={selectedDemos.length > 0 ? "向AI提问关于您的游戏数据..." : "请先选择要分析的Demo文件"}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                        e.preventDefault();
                        handleSubmit(e as any);
                      }
                    }}
                    disabled={isLoading || selectedDemos.length === 0}
                    className="flex-1 w-full text-base rounded-2xl p-4 pr-20 resize-none bg-muted/50 border-primary/20 focus-visible:ring-primary/70 focus-visible:ring-offset-0 focus-visible:ring-2 shadow-inner min-h-[60px] max-h-[200px]"
                    rows={1}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim() || selectedDemos.length === 0}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shrink-0 shadow-macos-md"
                  >
                    <Send className="w-5 h-5" />
                    <span className="sr-only">发送消息</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  按 Shift + Enter 换行。AI可以根据您的问题动态生成图表和深度分析。
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function ChatMessage({
  message,
  allMessages,
}: {
  message: Message
  allMessages: Message[]
}) {
  if (message.role === 'user') {
    return (
      <div className="flex gap-4 justify-end">
        <div className="max-w-[75%] rounded-2xl px-5 py-4 shadow-macos-md backdrop-blur-sm bg-primary text-primary-foreground rounded-br-lg">
          <div className="whitespace-pre-wrap text-base leading-relaxed">{message.content}</div>
        </div>
        <Avatar className="w-10 h-10 self-start border-2 border-white/20 shadow-macos-sm">
          <AvatarFallback className="bg-white/80 text-muted-foreground">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  if (message.role === 'assistant') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 justify-start">
          <Avatar className="w-10 h-10 self-start border-2 border-primary/20 shadow-macos-sm">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Cpu className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          {message.content && (
            <div className="max-w-[75%] rounded-2xl px-5 py-4 shadow-macos-md backdrop-blur-sm bg-white/80 text-card-foreground border border-white/20 rounded-bl-lg">
              <div className="whitespace-pre-wrap text-base leading-relaxed">{message.content}</div>
            </div>
          )}
        </div>
        {message.toolInvocations
          ?.filter(
            (toolInvocation) =>
              !allMessages.some(
                (m) =>
                  (m as any).role === "tool" &&
                  (m as any).tool_call_id === toolInvocation.toolCallId
              )
          )
          .map((toolInvocation: any) => (
            <div
              key={toolInvocation.toolCallId}
              className="flex gap-4 justify-start ml-14"
            >
              <div className="bg-white/80 text-card-foreground border border-white/20 rounded-2xl rounded-bl-lg px-5 py-4 shadow-macos-md backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <span className="h-2 w-2 bg-amber-500/70 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-amber-500/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-amber-500/70 rounded-full animate-bounce"></span>
                  </div>
                  <span className="text-base text-muted-foreground">
                    正在调用工具: <strong>{toolInvocation.toolName}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }
  
  if ((message as any).role === 'tool') {
    return (
       <div className="flex gap-4 justify-start ml-14">
         <div className="bg-zinc-100/80 text-card-foreground border border-zinc-200/80 rounded-2xl px-5 py-4 shadow-macos-md backdrop-blur-sm w-full max-w-[calc(75%_-_3.5rem)]">
           <div className="flex items-center gap-3 mb-2">
             <Settings2 className="w-5 h-5 text-zinc-500" />
             <span className="text-base font-semibold text-zinc-600">
               工具执行结果: {(message as any).name}
             </span>
           </div>
           <pre className="whitespace-pre-wrap bg-zinc-200/50 p-3 rounded-md text-sm text-zinc-800 overflow-x-auto">
             <code>{JSON.stringify(message.content, null, 2)}</code>
           </pre>
         </div>
       </div>
    );
  }

  return null;
}
