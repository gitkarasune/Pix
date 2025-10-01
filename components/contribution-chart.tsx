"use client"

import { useEffect, useState } from "react"
import { ResponsiveContainer, Tooltip, Cell, XAxis, YAxis, BarChart, Bar } from "recharts"

// Shape of our chart data
interface ContributionData {
  date: string
  count: number
}

export function ContributionChart() {
  const [data, setData] = useState<ContributionData[]>([])

  useEffect(() => {
    // Load activity from localStorage
    const downloads = localStorage.getItem("pixelvault-downloads")
    const favorites = localStorage.getItem("pixelvault-favorites")
    const collections = localStorage.getItem("pixelvault-collections")

    const downloadIds: string[] = downloads ? JSON.parse(downloads) : []
    const favoriteIds: string[] = favorites ? JSON.parse(favorites) : []
    const collectionData: { id: string; createdAt: string }[] = collections
      ? JSON.parse(collections)
      : []

    // Merge all activities into a date → count map
    const contributions: Record<string, number> = {}

    // For downloads & favorites, simulate contributions by id
    downloadIds.forEach(() => {
      const today = new Date().toISOString().slice(0, 10)
      contributions[today] = (contributions[today] || 0) + 1
    })

    favoriteIds.forEach(() => {
      const today = new Date().toISOString().slice(0, 10)
      contributions[today] = (contributions[today] || 0) + 1
    })

    // For collections, use stored createdAt
    collectionData.forEach((c) => {
      const date = c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
      contributions[date] = (contributions[date] || 0) + 1
    })

    // Fill last 30 days with 0 if no activity
    const today = new Date()
    const last30Days: ContributionData[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      last30Days.push({
        date: key,
        count: contributions[key] || 0,
      })
    }

    setData(last30Days)
  }, [])

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={6} // show every ~7th day
          />
          <YAxis hide />
          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            formatter={(value) => [`${value} actions`, "Contributions"]}
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.count > 3
                    ? "#3b82f6" // blue-500
                    : entry.count > 0
                    ? "#93c5fd" // blue-300
                    : "#e5e7eb" // gray-200
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Last 30 days of activity (downloads, favorites, collections)
      </p>
    </div>
  )
}
