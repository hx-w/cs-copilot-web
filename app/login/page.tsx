"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Lock, User, Github, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/" // Redirect to dashboard
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 tech-gradient-background">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?width=1920&height=1080&text=CS2+Background&bgColor=transparent&textColor=hsl(var(--primary)/0.1)')] bg-cover bg-center opacity-30"></div>

      <Card className="w-full max-w-md shadow-2xl relative z-10 glassmorphic">
        <CardHeader className="text-center space-y-4 pt-8">
          <div className="mx-auto p-3 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold tech-gradient-text">CS2 AI Copilot</CardTitle>
            <CardDescription className="text-lg mt-1 text-muted-foreground">解锁您的游戏潜能</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-lg">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md"
              >
                登录
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md"
              >
                注册
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-6 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login" className="text-sm font-medium">
                    邮箱
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email-login"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10 h-12 text-base"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login" className="text-sm font-medium">
                    密码
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password-login"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 text-base"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-base tech-glow-sm" disabled={isLoading}>
                  {isLoading ? "登录中..." : "安全登录"}
                  {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">或通过以下方式继续</span>
                </div>
              </div>

              <Button variant="outline" className="w-full h-12 text-base">
                <Github className="mr-2 h-5 w-5" />
                使用GitHub登录
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-6 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {" "}
                {/* Using same handler for mock */}
                <div className="space-y-2">
                  <Label htmlFor="username-register" className="text-sm font-medium">
                    用户名
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="username-register"
                      type="text"
                      placeholder="选择一个用户名"
                      className="pl-10 h-12 text-base"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register" className="text-sm font-medium">
                    邮箱
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email-register"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10 h-12 text-base"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register" className="text-sm font-medium">
                    密码
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password-register"
                      type="password"
                      placeholder="创建一个强密码"
                      className="pl-10 h-12 text-base"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-base tech-glow-sm" disabled={isLoading}>
                  {isLoading ? "创建中..." : "创建账户"}
                  {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>继续操作即表示您同意我们的</p>
            <div className="flex justify-center gap-2 mt-1">
              <Link href="#" className="underline hover:text-primary">
                服务条款
              </Link>
              <span>&</span>
              <Link href="#" className="underline hover:text-primary">
                隐私政策
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
