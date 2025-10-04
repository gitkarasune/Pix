
"use client"

import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import DashboardHeader from "@/components/dashboard-header"
import ProfileHeader from "@/components/profile-header"
import { ContributionChart } from "@/components/contribution-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Award, TrendingUp } from "lucide-react"
import { useUserStorage } from "@/lib/use-user-storage"
import ProfileLoading from "./loading"

export default function ProfilePage() {
  const { user } = useUser()
  const { getItem, removeItem } = useUserStorage()
  const [stats, setStats] = useState({
    downloads: 0,
    favorites: 0,
    collections: 0,
    joinedDate: new Date(),
  })

  useEffect(() => {
    const downloads = getItem("downloads")
    const favorites = getItem("favorites")
    const collections = getItem("collections")

    setStats({
      downloads: downloads ? JSON.parse(downloads).length : 0,
      favorites: favorites ? JSON.parse(favorites).length : 0,
      collections: collections ? JSON.parse(collections).length : 0,
      joinedDate: user?.createdAt ? new Date(user.createdAt) : new Date(),
    })
  }, [user, getItem])

  if (!user) {
    return (
      <ProfileLoading />
    )
  }
   const handleClearData = () => {
    removeItem("downloads")
    removeItem("favorites")
    removeItem("collections")
    removeItem("searches")
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-2 py-8">
        <div className="max-w-full mx-auto space-y-10">
          {/* Profile Header */}
          <ProfileHeader />

          {/* Contribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Your Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContributionChart />
            </CardContent>
          </Card>

          {/* Achievements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Image Collector
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Saved {stats.favorites}+ images as favorites
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Download Achiever
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Downloaded {stats.downloads}+ images
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Organizer
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Created {stats.collections}+ collections
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <a href="/dashboard">Browse Gallery</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/favorites">View Favorites</a>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleClearData()}
                >
                  Clear Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
