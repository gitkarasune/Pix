
"use client"

import { useUser } from "@clerk/nextjs"
import React, { useState, useEffect } from "react"
import DashboardHeader from "@/components/dashboard-header"
import { ContributionChart } from "@/components/contribution-chart"
import { ContributionHeatmap } from "@/components/contribution-heatmap"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  MapPin,
  Mail,
  Award,
  Download,
  Heart,
  Folder,
  Search,
  Star,
  User
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useUserStorage } from "@/lib/use-user-storage"
import ProfileLoading from "./loading"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// Types
interface ImageData {
  id?: string
  url?: string
  urls?: {
    small?: string
    full?: string
    regular?: string
  }
  alt_description?: string
  createdAt?: string
}

interface AchievementInfo {
  title: string
  icon: React.ReactNode
  description: string
  gradient: string
  highlight: string
  images: ImageData[]
}

interface ProfileData {
  gender: string
  location: string
  bio: string
}

export default function ProfilePage() {
  const { user } = useUser()
  const { getItem, setItem, removeItem } = useUserStorage()
  const [shake, setShake] = useState(false)
  const [stats, setStats] = useState({
    downloads: 0,
    favorites: 0,
    collections: 0,
    searches: 0,
    joinedDate: new Date(),
  })
  const [activeAchievement, setActiveAchievement] = useState<keyof typeof achievementKeys | null>(null)
  const [favoritesData, setFavoritesData] = useState<ImageData[]>([])
  const [downloadsData, setDownloadsData] = useState<ImageData[]>([])
  const [collectionsData, setCollectionsData] = useState<ImageData[]>([])

  const [profileData, setProfileData] = useState<ProfileData>({
    gender: "",
    location: "",
    bio: "",
  })
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    const downloads = getItem("downloads")
    const favorites = getItem("favorites")
    const collections = getItem("collections")
    const searches = getItem("searches")

    setStats({
      downloads: downloads ? JSON.parse(downloads).length : 0,
      favorites: favorites ? JSON.parse(favorites).length : 0,
      collections: collections ? JSON.parse(collections).length : 0,
      searches: searches ? JSON.parse(searches).length : 0,
      joinedDate: user?.createdAt ? new Date(user.createdAt) : new Date(),
    })

    // Load real image data
    setDownloadsData(downloads ? JSON.parse(downloads) : [])
    setFavoritesData(favorites ? JSON.parse(favorites) : [])
    setCollectionsData(collections ? JSON.parse(collections) : [])

    // Load profile info from localStorage
    const savedProfile = getItem("profile")
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile))
    }
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

  // save bio, location and pronoun
  const handleSaveProfile = () => {
    if (profileData.bio.length > 60) {
      toast.success("Bio must be 60 characters or less")
      return
    }
    setItem("profile", profileData)
    setEditOpen(false)
  }

  // Type-safe Achievement
  const achievementKeys = {
    favorites: "favorites",
    downloads: "downloads",
    collections: "collections",
    searches: "searches",
    joined: "joined",
  } as const

  // Content for the modal
  const achievementData: Record<keyof typeof achievementKeys, AchievementInfo> = {
    favorites: {
      title: "Image Collector",
      icon: <Award className="w-10 h-10 text-yellow-500" />,
      description: "You've favorited beautiful images that reflect your style and inspiration.",
      gradient: "from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/30",
      highlight: `Favorited ${stats.favorites}+ images`,
      images: favoritesData,
    },
    downloads: {
      title: "Download Master",
      icon: <Download className="w-10 h-10 text-blue-500" />,
      description: "You've downloaded tons of inspiring visuals for your creative journey.",
      gradient: "from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/30",
      highlight: `Downloaded ${stats.downloads}+ images`,
      images: downloadsData,
    },
    collections: {
      title: "Organizer Pro",
      icon: <Folder className="w-10 h-10 text-purple-500" />,
      description: "You've curated amazing collections that showcase your eye for art.",
      gradient: "from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/30",
      highlight: `Created ${stats.collections}+ collections`,
      images: collectionsData,
    },
    searches: {
      title: "Explorer",
      icon: <Search className="w-10 h-10 text-green-500" />,
      description: "You've explored deep across categories discovering hidden gems.",
      gradient: "from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/30",
      highlight: `Made ${stats.searches}+ searches`,
      images: [],
    },
    joined: {
      title: "Early Adopter",
      icon: <Star className="w-10 h-10 text-indigo-500" />,
      description: "You joined early — shaping the community from the beginning.",
      gradient: "from-indigo-100 to-indigo-200 dark:from-indigo-900/20 dark:to-indigo-800/30",
      highlight: `Joined ${stats.joinedDate.toLocaleDateString()}`,
      images: [],
    },
  }

  const openDialog = (type: keyof typeof achievementKeys) => {
    setActiveAchievement(type)

    const data = achievementData[type].images
    if (!data || data.length === 0) return
  }

  const closeDialog = () => setActiveAchievement(null)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Profile Info */}

          <div className="lg:col-span-3 space-y-4">

            {/* Profile Image - Responsive sizing */}
            <div className="relative">
              <Avatar
                className="cursor-pointer hover:opacity-90 transition-opacity border-2 border-border w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-full lg:h-full sm:left-0 md:left-0 lg:left-0"
              >
                <AvatarImage
                  src={user.imageUrl || "/placeholder.png"}
                  width={70}
                  height={70}
                  alt={user.fullName || "User"}
                />
                <AvatarFallback className="text-4xl sm:text-5xl md:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Info */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{user.fullName || `${user.firstName} ${user.lastName}`}</h1>
              <div className="flex items-center gap-2">
              <p className="text-muted-foreground">@{user.username || user.firstName?.toLowerCase()}</p>
              {profileData.gender && (
                <p className="text-sm text-muted-foreground capitalize">• {profileData.gender}</p>
              )}
              </div>
            </div>

            {/* Edit Profile Button */}
            <Button className="w-full bg-transparent" variant="outline" onClick={() => setEditOpen(true)}>
              Edit profile
            </Button>

            {/* Bio Section */}
            <div className="space-y-4">
                <div>
                {profileData.bio && <p className="text-lg italic">{profileData.bio}</p>}
                </div>

              {/* Location */}
              {profileData.location && (
                <p className="flex items-center gap-2 text-lg text-muted-foreground">
                  <MapPin className="h-6 w-6" /> {profileData.location}
                </p>
              )}

              {/* Email */}
              <div className="flex items-center gap-2 text-lg text-muted-foreground">
                <Mail className="h-6 w-6 " />
                <span className="truncate">{user.primaryEmailAddress?.emailAddress}</span>
              </div>
            </div>

            {/* Image Stats */}
            <Card>
              <CardContent className="p-3">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Explorer Stats</h3>
                  <div className="space-y-2 text-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Download className="h-6 w-6 text-blue-500" />
                        <span>Downloads</span>
                      </div>
                      <span className="font-semibold">{stats.downloads}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-6 w-6 text-red-500" />
                        <span>Favorites</span>
                      </div>
                      <span className="font-semibold">{stats.favorites}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Folder className="h-6 w-6 text-purple-500" />
                        <span>Collections</span>
                      </div>
                      <span className="font-semibold">{stats.collections}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Search className="h-6 w-6 text-orange-500" />
                        <span>Searches</span>
                      </div>
                      <span className="font-semibold">{stats.searches}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator className="" />

            {/* Achievement Badges */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg mb-2">Achievements</h3>
              <div className="flex flex-wrap justify-start gap-3">
                {(
                  Object.keys(achievementKeys) as Array<keyof typeof achievementKeys>
                ).map((key) => {
                  const data = achievementData[key]
                  const hasData =
                    (key === "favorites" && stats.favorites > 0) ||
                    (key === "downloads" && stats.downloads > 0) ||
                    (key === "collections" && stats.collections > 0) ||
                    (key === "searches" && stats.searches > 0) ||
                    key === "joined"

                  if (!hasData) return null

                  return (
                    <button
                      key={key}
                      onClick={() => openDialog(key)}
                      className={`w-[70px] h-[70px] rounded-full flex items-center justify-center hover:scale-105 transition bg-gradient-to-br ${data.gradient}`}
                    >
                      {data.icon}
                    </button>
                  )
                })}
              </div>
            </div>

          </div>

          {/* Main content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Overview Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Overview</h2>

              {/* Contribution Heatmap */}
              <ContributionHeatmap />
            </div>

            {/* Contribution Chart */}
            <div>
              <ContributionChart />
            </div>

            {/* Achievements */}
            <div>
               <h2 className="text-xl font-semibold mb-4">Achievements</h2> 
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                  stats.favorites === 0 ? "" :
                    <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Image Collector</h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Saved {stats.favorites}+ images as favorites
                        </p>
                        <Badge className="mt-3 bg-yellow-600 hover:bg-yellow-700">Gold</Badge>
                      </CardContent>
                    </Card>
                }
                {
                  stats.downloads === 0 ? "" :
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Download Master</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">Downloaded {stats.downloads}+ images</p>
                        <Badge className="mt-3 bg-blue-600 hover:bg-blue-700">Platinum</Badge>
                      </CardContent>
                    </Card>
                }

                {
                  stats.collections === 0 ? "" :
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Folder className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Organizer Pro</h3>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          Created {stats.collections}+ collections
                        </p>
                        <Badge className="mt-3 bg-purple-600 hover:bg-purple-700">Silver</Badge>
                      </CardContent>
                    </Card>
                }

                {
                  stats.searches === 0 ? "" :
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Explorer</h3>
                        <p className="text-sm text-green-700 dark:text-green-300">Made {stats.searches}+ searches</p>
                        <Badge className="mt-3 bg-green-600 hover:bg-green-700">Bronze</Badge>
                      </CardContent>
                    </Card>
                }

                {
                  stats.collections === 2 ? "" :
                    <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Heart className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">Curator</h3>
                        <p className="text-sm text-red-700 dark:text-red-300">Curated amazing collections</p>
                        <Badge className="mt-3 bg-red-600 hover:bg-red-700">Elite</Badge>
                      </CardContent>
                    </Card>
                }

                <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-700">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Early Adopter</h3>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                      Joined {stats.joinedDate.toLocaleDateString()}
                    </p>
                    <Badge className="mt-3 bg-indigo-600 hover:bg-indigo-700">Legendary</Badge>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <a href="/dashboard">Browse Gallery</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/favorites">View Favorites</a>
                  </Button>
                  <Button variant="outline" onClick={handleClearData}>
                    Clear Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Achievement Dialog */}
      <AnimatePresence>
        {activeAchievement && (
          <Dialog open={!!activeAchievement} onOpenChange={closeDialog}>
            <DialogContent className="max-w-3xl sm:max-w-4xl md:max-w-6xl p-8 rounded-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader className="flex items-center gap-3 mb-4">
                  {achievementData[activeAchievement].icon}
                  <DialogTitle className="text-3xl font-bold">
                    {achievementData[activeAchievement].title}
                  </DialogTitle>
                </DialogHeader>

                <p className="text-muted-foreground text-lg mb-3">
                  {achievementData[activeAchievement].description}
                </p>

                <Badge variant="secondary" className="text-base mb-4">
                  {achievementData[activeAchievement].highlight}
                </Badge>

                {/* Display User's Actual Images */}
                {achievementData[activeAchievement].images?.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4 mt-4">
                    {achievementData[activeAchievement].images
                      .slice(0, 3)
                      .map((img: ImageData, i: number) => (
                        <motion.img
                          key={i}
                          src={img.urls?.small || img.url || "/placeholder.png"}
                          alt={img.alt_description || "Image"}
                          className="w-full h-32 sm:h-36 object-cover rounded-xl shadow-md transition-transform"
                          whileHover={{ scale: 1.02 }}
                        />
                      ))}
                  </div>
                )}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>


      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => {
        if (!open) {
          setShake(true)
          setTimeout(() => setShake(false), 600)
        } else {
          setEditOpen(true)
        }
      }}>
        <AnimatePresence>

        { editOpen && (
          
        <DialogContent className={`max-w-2xl sm:max-w-3xl md:max-w-5xl p-6 rounded-2xl ${shake ? "shake" : ""}`}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25 }}
        >
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold flex items-center gap-2">
              <User className="h-8 w-8 text-blue-500" /> Edit Profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Gender */}
            <div>
              <Label className="text-gray-900 dark:text-white font-semibold dark:font-normal mb-2">Gender</Label>
              <Select
                value={profileData.gender}
                onValueChange={(val) => setProfileData((p) => ({ ...p, gender: val }))}
              >
                <SelectTrigger className="w-full pl-10 pr-10 border border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-gray-900 dark:placeholder:text-white focus:border-cyan-500 focus:ring-cyan-500/20 backdrop-blur-sm transition-all duration-300 h-14">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="he/him">He/Him</SelectItem>
                  <SelectItem value="she/her">She/Her</SelectItem>
                  <SelectItem value="they/them">They/Them</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div>
              <Label className="text-gray-900 dark:text-white font-semibold dark:font-normal mb-2">Location</Label>
              <Input
                type="text"
                placeholder="Enter your location"
                className="pl-10 pr-10 border border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-gray-900 dark:placeholder:text-white focus:border-cyan-500 focus:ring-cyan-500/20 backdrop-blur-sm transition-all duration-300 h-14"
                value={profileData.location}
                onChange={(e) => setProfileData((p) => ({ ...p, location: e.target.value }))}
              />
            </div>

            {/* Bio */}
            <div>
              <Label className="text-gray-900 dark:text-white font-semibold dark:font-normal mb-2">Bio (max 60 characters)</Label>
              <Input
                type="text"
                placeholder="Say your bio"
                value={profileData.bio}
                className="pl-10 pr-10 border border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-gray-900 dark:placeholder:text-white focus:border-cyan-500 focus:ring-cyan-500/20 backdrop-blur-sm transition-all duration-300 h-14"
                onChange={(e) => setProfileData((p) => ({ ...p, bio: e.target.value }))}
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground mt-1">{profileData.bio.length}/60</p>
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </DialogFooter>
          </motion.div>
        </DialogContent>
        )}
        </AnimatePresence>
      </Dialog>
    </div>
  )
}
