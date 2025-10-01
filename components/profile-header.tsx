"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Heart, Folder } from "lucide-react"

interface UserStats {
  downloads: number
  favorites: number
  collections: number
  joinedDate: Date
}

export default function ProfileHeader() {
  const { user } = useUser()
  const [stats, setStats] = useState<UserStats>({
    downloads: 0,
    favorites: 0,
    collections: 0,
    joinedDate: new Date(),
  })

  useEffect(() => {
    // Load stats from localStorage
    const downloads = localStorage.getItem("pixelvault-downloads")
    const favorites = localStorage.getItem("pixelvault-favorites")
    const collections = localStorage.getItem("pixelvault-collections")

    setStats({
      downloads: downloads ? JSON.parse(downloads).length : 0,
      favorites: favorites ? JSON.parse(favorites).length : 0,
      collections: collections ? JSON.parse(collections).length : 0,
      joinedDate: user?.createdAt ? new Date(user.createdAt) : new Date(),
    })
  }, [user])

  if (!user) {
    return (
      <div className="w-full p-6 text-center border rounded-lg bg-muted/30">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="relative border rounded-lg overflow-hidden">
      <div className="p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <Avatar className="h-28 w-28 ring-4 ring-white dark:ring-zinc-900 shadow-md">
          <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={user.fullName || "User"} />
          <AvatarFallback className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </AvatarFallback>
        </Avatar>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold">{user.fullName || `${user.firstName} ${user.lastName}`}</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 text-muted-foreground mt-2">
            {user.primaryEmailAddress?.emailAddress && (
              <span className="text-sm">{user.primaryEmailAddress.emailAddress}</span>
            )}
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              Joined {stats.joinedDate.toLocaleDateString()}
            </div>
          </div>
          <div className="mt-3">
            <Badge className="shadow-sm cursor-not-allowed">
              Edit Profile
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-6 md:gap-10 mt-6 md:mt-0">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
              <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xl font-bold">{stats.downloads}</span>
            <span className="text-xs text-muted-foreground">Downloads</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
              <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xl font-bold">{stats.favorites}</span>
            <span className="text-xs text-muted-foreground">Favorites</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
              <Folder className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xl font-bold">{stats.collections}</span>
            <span className="text-xs text-muted-foreground">Collections</span>
          </div>
        </div>
      </div>
    </div>
  )
}
