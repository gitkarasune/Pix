"use client"

import { useEffect, useState } from "react" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUserStorage } from "@/lib/use-user-storage"
import { Skeleton } from "@/components/ui/skeleton"

interface ContributionDay {
    date: string
    count: number
    level: 0 | 1 | 2 | 3 | 4
}

export function ContributionHeatmap() {
    const { getItem } = useUserStorage()
    const [contributions, setContributions] = useState<ContributionDay[]>([])
    const [totalContributions, setTotalContributions] = useState(0)

    useEffect(() => {
        const downloads = getItem("downloads")
        const favorites = getItem("favorites")
        const collections = getItem("collections")

        const downloadIds: string[] = downloads ? JSON.parse(downloads) : []
        const favoriteIds: string[] = favorites ? JSON.parse(favorites) : []
        const collectionData: { id: string; createdAt: string }[] = collections ? JSON.parse(collections) : []

        const today = new Date()
        const contributionMap: Record<string, number> = {}

        // Mark today's contributions
        const todayKey = today.toISOString().slice(0, 10)
        contributionMap[todayKey] = downloadIds.length + favoriteIds.length

        // Mark collection contributions by date
        collectionData.forEach((c) => {
            const key = c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : todayKey
            contributionMap[key] = (contributionMap[key] || 0) + 1
        })

        // Generate last 365 days
        const days: ContributionDay[] = []
        let total = 0
        for (let i = 364; i >= 0; i--) {
            const d = new Date(today)
            d.setDate(today.getDate() - i)
            const key = d.toISOString().slice(0, 10)
            const count = contributionMap[key] || 0
            total += count

            // Determine level (0-4) based on count
            let level: 0 | 1 | 2 | 3 | 4 = 0
            if (count > 0) level = 1
            if (count >= 3) level = 2
            if (count >= 6) level = 3
            if (count >= 10) level = 4

            days.push({ date: key, count, level })
        }

        setContributions(days)
        setTotalContributions(total)
    }, [getItem])

    // Group by weeks
    const weeks: ContributionDay[][] = []
    for (let i = 0; i < contributions.length; i += 7) {
        weeks.push(contributions.slice(i, i + 7))
    }

    const getLevelColor = (level: number) => {
        switch (level) {
            case 0:
                return "bg-muted"
            case 1:
                return "bg-green-200 dark:bg-green-900/40"
            case 2:
                return "bg-green-400 dark:bg-green-700/60"
            case 3:
                return "bg-green-600 dark:bg-green-600/80"
            case 4:
                return "bg-green-800 dark:bg-green-500"
            default:
                return "bg-muted"
        }
    }

    if (contributions.length === 0) {
        return <Skeleton className="h-32 w-full" />
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{totalContributions} contributions in the last year</CardTitle>
            </CardHeader>
            <CardContent className="text-black dark:text-white">
                <div className="overflow-x-auto w-full">
                    <TooltipProvider>
                    <div className="flex gap-[3px] w-full mx-auto p-2">
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-[3px] mx-auto">
                                {week.map((day, dayIndex) => (
                                    <Tooltip
                                    key={dayIndex}
                                    >
                                        <TooltipTrigger asChild>
                                            <div 
                                                className={`w-[16px] h-[16px] lg:w-[20px] lg:h-[20px] rounded-sm ${getLevelColor(day.level)} transition-colors border border-2`}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{day.date}: {day.count} contributions</p>
                                        </TooltipContent>
                                    </Tooltip>    
                                ))}
                            </div>
                        ))}
                    </div>
                    </TooltipProvider>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <span>Less</span>
                    <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map((level) => (
                            <div key={level} className={`w-[10px] h-[10px] rounded-sm ${getLevelColor(level)}`} />
                        ))}
                    </div>
                    <span>More</span>
                </div>
            </CardContent>
        </Card>
    )
}
