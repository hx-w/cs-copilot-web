"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  LinkIcon,
  FileText,
  Play,
  Trash2,
  Download,
  Eye,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"
import { Clock, MapIcon } from "lucide-react"

// Mock data remains the same
const mockDemos = [
  {
    id: 1,
    name: "de_dust2_match_001.dem",
    size: "45.2 MB",
    uploadDate: "2024-01-15",
    status: "completed",
    progress: 100,
    map: "Dust II",
    duration: "32:45",
  },
  {
    id: 2,
    name: "de_mirage_clutch.dem",
    size: "38.7 MB",
    uploadDate: "2024-01-15",
    status: "analyzing",
    progress: 65,
    map: "Mirage",
    duration: "28:12",
  },
  {
    id: 3,
    name: "de_inferno_eco.dem",
    size: "52.1 MB",
    uploadDate: "2024-01-14",
    status: "failed",
    progress: 0,
    map: "Inferno",
    duration: "41:33",
  },
  {
    id: 4,
    name: "de_nuke_strategy.dem",
    size: "61.5 MB",
    uploadDate: "2024-01-13",
    status: "queued",
    progress: 0,
    map: "Nuke",
    duration: "38:50",
  },
]

export default function DemosPage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)
    setFileName(file.name)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          // Add to mockDemos or trigger actual upload
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
        return {
          badge: (
            <Badge className="bg-green-100 text-green-700 border-green-300">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              已完成
            </Badge>
          ),
          icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        }
      case "analyzing":
        return {
          badge: (
            <Badge className="bg-blue-100 text-blue-700 border-blue-300 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              分析中
            </Badge>
          ),
          icon: <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />,
        }
      case "failed":
        return {
          badge: (
            <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-300">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              失败
            </Badge>
          ),
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
        }
      default: // queued
        return {
          badge: (
            <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-300">
              <Clock className="w-3.5 h-3.5 mr-1" />
              等待中
            </Badge>
          ),
          icon: <Clock className="w-5 h-5 text-slate-500" />,
        }
    }
  }

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
              <h1 className="text-3xl md:text-4xl font-bold">Demo 管理</h1>
              <p className="text-muted-foreground mt-1 text-lg">上传、管理和追踪您的CS2 Demo文件分析进度。</p>
            </div>
          </div>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-2 bg-muted p-1 rounded-lg max-w-md">
              <TabsTrigger
                value="upload"
                className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md"
              >
                上传Demo
              </TabsTrigger>
              <TabsTrigger
                value="manage"
                className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md"
              >
                管理Demo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Upload className="w-6 h-6 text-primary" />
                      上传Demo文件
                    </CardTitle>
                    <CardDescription>支持.dem格式文件，最大100MB。上传后将自动加入分析队列。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <label
                      htmlFor="file-upload"
                      className={cn(
                        "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
                        dragActive
                          ? "border-primary bg-secondary"
                          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-secondary/50",
                      )}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload
                          className={cn(
                            "mx-auto h-12 w-12 mb-4",
                            dragActive ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                        <p className={cn("text-lg font-medium mb-2", dragActive ? "text-primary" : "text-foreground")}>
                          拖拽文件到此处
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">或点击选择文件</p>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(dragActive && "border-primary text-primary")}
                        >
                          选择Demo文件
                        </Button>
                      </div>
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".dem"
                      />
                    </label>

                    {isUploading && (
                      <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground font-medium">{fileName || "上传中..."}</span>
                          <span className="font-semibold text-primary">{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2.5" indicatorClassName="bg-primary" />
                      </div>
                    )}
                    {!isUploading && uploadProgress === 100 && fileName && (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        <CheckCircle2 className="inline w-5 h-5 mr-2" /> 文件 "{fileName}" 上传成功并已加入分析队列！
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <LinkIcon className="w-6 h-6 text-primary" />
                      通过链接上传
                    </CardTitle>
                    <CardDescription>输入Demo文件的公开下载链接，我们将为您获取并分析。</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="demo-url" className="font-medium">
                        Demo文件链接
                      </Label>
                      <Input
                        id="demo-url"
                        type="url"
                        placeholder="https://example.com/your_demo.dem"
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="demo-name" className="font-medium">
                        文件名称（可选）
                      </Label>
                      <Input id="demo-name" type="text" placeholder="my_awesome_match.dem" className="h-12 text-base" />
                    </div>
                    <Button className="w-full h-12 text-base tech-glow-sm">
                      开始下载并分析 <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="manage" className="mt-6 space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Demo文件列表</CardTitle>
                  <CardDescription>管理您上传的所有Demo文件及其分析状态。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockDemos.map((demo) => {
                    const statusInfo = getStatusInfo(demo.status)
                    return (
                      <div
                        key={demo.id}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4 mb-3 md:mb-0">
                          {statusInfo.icon}
                          <div className="flex-1">
                            <h4 className="font-semibold text-base">{demo.name}</h4>
                            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              <span>
                                <FileText className="inline w-3 h-3 mr-1" />
                                {demo.size}
                              </span>
                              <span>
                                <Play className="inline w-3 h-3 mr-1" />
                                {demo.duration}
                              </span>
                              <span>
                                <MapIcon className="inline w-3 h-3 mr-1" />
                                {demo.map}
                              </span>
                              <span>
                                <Clock className="inline w-3 h-3 mr-1" />
                                {demo.uploadDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
                          <div className="flex-1 md:flex-none">{statusInfo.badge}</div>
                          {demo.status === "analyzing" && (
                            <div className="w-full md:w-24 mt-1 md:mt-0">
                              <Progress value={demo.progress} className="h-2" indicatorClassName="bg-blue-500" />
                            </div>
                          )}
                          <div className="flex gap-2 mt-2 md:mt-0">
                            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary">
                              <Eye className="w-5 h-5" /> <span className="sr-only">查看</span>
                            </Button>
                            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary">
                              <Download className="w-5 h-5" /> <span className="sr-only">下载</span>
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-5 h-5" /> <span className="sr-only">删除</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
