// "use client"

// import { useUser } from "@clerk/nextjs"
// import DashboardHeader from "@/components/dashboard-header"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Calendar, Download, Heart, ImageIcon, Mail, User } from "lucide-react"
// import { useState, useEffect } from "react"

// export default function ProfilePage() {
//   const { user } = useUser()
//   const [stats, setStats] = useState({
//     totalDownloads: 0,
//     totalFavorites: 0,
//     totalSearches: 0,
//     joinedDate: new Date(),
//   })

//   useEffect(() => {
//     // Load user stats from localStorage
//     const downloads = localStorage.getItem("pixelvault-downloads")
//     const favorites = localStorage.getItem("pixelvault-favorites")
//     const searches = localStorage.getItem("pixelvault-searches")

//     setStats({
//       totalDownloads: downloads ? JSON.parse(downloads).length : 0,
//       totalFavorites: favorites ? JSON.parse(favorites).length : 0,
//       totalSearches: searches ? JSON.parse(searches).length : 0,
//       joinedDate: user?.createdAt ? new Date(user.createdAt) : new Date(),
//     })
//   }, [user])

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-background">
//         <DashboardHeader />
//         <div className="container mx-auto px-4 py-8">
//           <div className="text-center">
//             <p>Loading profile...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <DashboardHeader />

//       <main className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto space-y-8">
//           {/* Profile Header */}
//           <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
//             <CardContent className="p-8">
//               <div className="flex flex-col md:flex-row items-center gap-6">
//                 <Avatar className="h-24 w-24">
//                   <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={user.fullName || "User"} />
//                   <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
//                     {user.firstName?.[0]}
//                     {user.lastName?.[0]}
//                   </AvatarFallback>
//                 </Avatar>

//                 <div className="text-center md:text-left flex-1">
//                   <h1 className="text-3xl font-bold mb-2">{user.fullName || `${user.firstName} ${user.lastName}`}</h1>
//                   <div className="flex flex-col md:flex-row items-center gap-4 text-muted-foreground mb-4">
//                     <div className="flex items-center gap-2">
//                       <Mail className="h-4 w-4" />
//                       {user.primaryEmailAddress?.emailAddress}
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Calendar className="h-4 w-4" />
//                       Joined {stats.joinedDate.toLocaleDateString()}
//                     </div>
//                   </div>
//                   <Badge variant="secondary" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
//                     PixelVault Explorer
//                   </Badge>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <Card className="text-center hover:shadow-lg transition-shadow">
//               <CardHeader className="pb-3">
//                 <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-2">
//                   <Download className="h-6 w-6 text-white" />
//                 </div>
//                 <CardTitle className="text-2xl font-bold">{stats.totalDownloads}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground">Images Downloaded</p>
//               </CardContent>
//             </Card>

//             <Card className="text-center hover:shadow-lg transition-shadow">
//               <CardHeader className="pb-3">
//                 <div className="mx-auto w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mb-2">
//                   <Heart className="h-6 w-6 text-white" />
//                 </div>
//                 <CardTitle className="text-2xl font-bold">{stats.totalFavorites}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground">Favorite Images</p>
//               </CardContent>
//             </Card>

//             <Card className="text-center hover:shadow-lg transition-shadow">
//               <CardHeader className="pb-3">
//                 <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-2">
//                   <ImageIcon className="h-6 w-6 text-white" />
//                 </div>
//                 <CardTitle className="text-2xl font-bold">{stats.totalSearches}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground">Searches Made</p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Account Information */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <User className="h-5 w-5" />
//                 Account Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium text-muted-foreground">First Name</label>
//                   <p className="text-lg">{user.firstName || "Not provided"}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-muted-foreground">Last Name</label>
//                   <p className="text-lg">{user.lastName || "Not provided"}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-muted-foreground">Email Address</label>
//                   <p className="text-lg">{user.primaryEmailAddress?.emailAddress}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-muted-foreground">Account Status</label>
//                   <Badge variant="outline" className="text-green-600 border-green-600">
//                     Active
//                   </Badge>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Quick Actions */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Quick Actions</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-wrap gap-4">
//                 <Button asChild>
//                   <a href="/dashboard">Browse Gallery</a>
//                 </Button>
//                 <Button variant="outline" asChild>
//                   <a href="/favorites">View Favorites</a>
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     localStorage.clear()
//                     window.location.reload()
//                   }}
//                 >
//                   Clear Data
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   )
// }











"use client"

import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import DashboardHeader from "@/components/dashboard-header"
import ProfileHeader from "@/components/profile-header"
import { ContributionChart } from "@/components/contribution-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
import { Activity, Award, TrendingUp } from "lucide-react"

export default function ProfilePage() {
  const { user } = useUser()
  const [stats, setStats] = useState({
    downloads: 0,
    favorites: 0,
    collections: 0,
    joinedDate: new Date(),
  })

  useEffect(() => {
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
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-1 py-8">
        <div className="max-w-6xl mx-auto space-y-10">
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
