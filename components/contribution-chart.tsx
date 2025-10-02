"use client"

import { useEffect, useState, useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Activity } from "lucide-react"
import { useUserStorage } from "@/lib/use-user-storage"

interface ContributionData {
  date: string
  downloads: number
  favorites: number
  collections: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipProps<number, string>["payload"]
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    const d = payload[0].payload as ContributionData
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg space-y-1">
        <p className="font-medium text-gray-900 dark:text-white">{d.date}</p>
        <p className="text-sm text-blue-500">
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          {d.downloads} downloads
        </p>
        <p className="text-sm text-green-500">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          {d.favorites} favorites
        </p>
        <p className="text-sm text-purple-500">
          <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
          {d.collections} collections
        </p>
      </div>
    )
  }
  return null
}

export function ContributionChart() {
  const { getItem } = useUserStorage()
  const [data, setData] = useState<ContributionData[]>([])
  const [timeRange, setTimeRange] = useState("30days")

  useEffect(() => {
    const downloads = getItem("downloads")
    const favorites = getItem("favorites")
    const collections = getItem("collections")

    const downloadIds: string[] = downloads ? JSON.parse(downloads) : []
    const favoriteIds: string[] = favorites ? JSON.parse(favorites) : []
    const collectionData: { id: string; createdAt: string }[] = collections ? JSON.parse(collections) : []

    const today = new Date()
    const contributions: Record<string, { downloads: number; favorites: number; collections: number }> = {}

    // mark downloads + favorites on today
    const todayKey = today.toISOString().slice(0, 10)
    contributions[todayKey] = {
      downloads: downloadIds.length,
      favorites: favoriteIds.length,
      collections: 0,
    }

    // mark collections by date
    collectionData.forEach((c) => {
      const key = c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : todayKey
      if (!contributions[key]) {
        contributions[key] = { downloads: 0, favorites: 0, collections: 0 }
      }
      contributions[key].collections += 1
    })

    // Fill range
    const days = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90
    const arr: ContributionData[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      arr.push({
        date: key,
        downloads: contributions[key]?.downloads || 0,
        favorites: contributions[key]?.favorites || 0,
        collections: contributions[key]?.collections || 0,
      })
    }

    setData(arr)
  }, [getItem, timeRange])

  const chartData = useMemo(() => data, [data])

  return (
    <Card className="w-full px-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Contribution Activity
          </CardTitle>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="downloads" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="favorites" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="collections" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Downloads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Favorites</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Collections</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

