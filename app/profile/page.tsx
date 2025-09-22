"use client"

import { useUser } from "@clerk/nextjs"
import DashboardHeader from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Download, Heart, ImageIcon, Mail, User } from "lucide-react"
import { useState, useEffect } from "react"

export default function ProfilePage() {
  const { user } = useUser()
  const [stats, setStats] = useState({
    totalDownloads: 0,
    totalFavorites: 0,
    totalSearches: 0,
    joinedDate: new Date(),
  })

  useEffect(() => {
    // Load user stats from localStorage
    const downloads = localStorage.getItem("pixelvault-downloads")
    const favorites = localStorage.getItem("pixelvault-favorites")
    const searches = localStorage.getItem("pixelvault-searches")

    setStats({
      totalDownloads: downloads ? JSON.parse(downloads).length : 0,
      totalFavorites: favorites ? JSON.parse(favorites).length : 0,
      totalSearches: searches ? JSON.parse(searches).length : 0,
      joinedDate: user?.createdAt ? new Date(user.createdAt) : new Date(),
    })
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={user.fullName || "User"} />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl font-bold mb-2">{user.fullName || `${user.firstName} ${user.lastName}`}</h1>
                  <div className="flex flex-col md:flex-row items-center gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user.primaryEmailAddress?.emailAddress}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Joined {stats.joinedDate.toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    PixelVault Explorer
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-2">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">{stats.totalDownloads}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Images Downloaded</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mb-2">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">{stats.totalFavorites}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Favorite Images</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-2">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">{stats.totalSearches}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Searches Made</p>
              </CardContent>
            </Card>
          </div>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">First Name</label>
                  <p className="text-lg">{user.firstName || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                  <p className="text-lg">{user.lastName || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <p className="text-lg">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  onClick={() => {
                    localStorage.clear()
                    window.location.reload()
                  }}
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
