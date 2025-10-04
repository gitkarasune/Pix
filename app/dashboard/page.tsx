

"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import DashboardHeader from "@/components/dashboard-header"
import SearchBar from "@/components/search-bar"
import ImageGrid from "@/components/image-grid"
import ImageModal from "@/components/image-model"
import TrendingSection from "@/components/trending-section"
import Collections from "@/components/collections"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { UnsplashImage } from "@/lib/types"
import { unsplashAPI } from "@/lib/unsplash"
import { deepSeekAPI } from "@/lib/deepseek"
import { Button } from "@/components/ui/button"
import { RefreshCw, Grid, TrendingUp, Folder } from "lucide-react"
import { toast } from "sonner"
import { useUserStorage } from "@/lib/use-user-storage"

export default function DashboardPage() {
  const { user } = useUser()
  const [images, setImages] = useState<UnsplashImage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [currentQuery, setCurrentQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("gallery")
  const { getItem, setItem } = useUserStorage();

  // Load initial random images
  useEffect(() => {
    loadRandomImages()
  }, [])

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = getItem("favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [getItem])

  const loadRandomImages = async () => {
    try {
      setLoading(true)
      const randomImages = await unsplashAPI.getRandomPhotos(30)
      setImages(randomImages)
      setCurrentQuery("")
    } catch (error) {
      console.error("Error loading images:", error)
      toast.error("Failed to load images. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    try {
      setSearchLoading(true)
      setCurrentQuery(query)
      setPage(1)

      // Get search results
      const searchResults = await unsplashAPI.searchPhotos(query, 1, 30)
      setImages(searchResults.results)

      // Get AI suggestions
      const aiSuggestions = await deepSeekAPI.generateSearchSuggestions(query)
      setSuggestions(aiSuggestions)

      // Save search to history
      const savedSearches = getItem("searches")
      const searches = savedSearches ? JSON.parse(savedSearches) : []
      const updatedSearches = [query, ...searches.filter((s: string) => s !== query)].slice(0, 10)
      setItem("searches", updatedSearches)
    } catch (error) {
      console.error("Error searching images:", error)
      toast.error("Failed to search images. Please try again.")
    } finally {
      setSearchLoading(false)
    }
  }

  const handleCategorySelect = (category: string) => {
    handleSearch(category)
    setActiveTab("gallery")
  }

  const handleImageClick = (image: UnsplashImage) => {
    setSelectedImage(image)
    setIsModalOpen(true)
  }

  const handleDownload = async (image: UnsplashImage) => {
    try {
      const res = await fetch(image.links.download_location, {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        },
      })
      const data = await res.json()
      const downloadUrl = data.url

      const imgRes = await fetch(downloadUrl)
      const blob = await imgRes.blob()

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `pix-${image.id}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      const savedDownloads = getItem("downloads")
     const downloads = savedDownloads ? JSON.parse(savedDownloads) : []
      const updatedDownloads = [image.id, ...downloads.filter((id: string) => id !== image.id)]
      setItem("downloads", updatedDownloads)

      toast.success("Your image is being downloaded.")
    } catch (error) {
      console.error("Error downloading image:", error)
      toast.error("Failed to download image. Please try again.")
    }
  }

  const handleFavorite = (image: UnsplashImage) => {
    const newFavorites = favorites.includes(image.id)
      ? favorites.filter((id) => id !== image.id)
      : [...favorites, image.id]

    setFavorites(newFavorites)
    setItem("favorites", newFavorites)
    toast.success(`${favorites.includes(image.id) ? 'Image removed from your favorites.' : 'Image added to your favorites.'}`)
  }

  const loadMoreImages = async () => {
    if (searchLoading) return

    try {
      setSearchLoading(true)
      const nextPage = page + 1

      let newImages: UnsplashImage[]
      if (currentQuery) {
        const searchResults = await unsplashAPI.searchPhotos(currentQuery, nextPage, 30)
        newImages = searchResults.results
      } else {
        newImages = await unsplashAPI.getRandomPhotos(30)
      }

      setImages((prev) => [...prev, ...newImages])
      setPage(nextPage)
    } catch (error) {
      console.error("Error loading more images:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 relative overflow-x-hidden max-w-full">
        {/* Welcome Section */}
        <div className="text-center mb-8 relative">

          <div className="absolute pointer-events-none -z-0 top-20 left-20 w-72 h-72 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute pointer-events-none -z-0 bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full blur-3xl" />
          <div className="absolute pointer-events-none -z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 dark:from-indigo-500/10 dark:to-cyan-500/10 rounded-full blur-3xl" />

          {/* <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || "Explorer"}!</h1> */}
          <h1 className="mb-2 mt-5 text-4xl font-bold md:text-6xl xl:text-7xl xl:[line-height:1.125]">
            Welcome back, {user?.firstName || "Explorer"}!
          </h1>
          <p className="text-muted-foreground mb-6">
            Discover amazing images powered by AI. Search, explore, and build your collection.
          </p>

          <SearchBar
            onSearch={handleSearch}
            onCategorySelect={handleCategorySelect}
            loading={searchLoading}
            suggestions={suggestions}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
          <TabsList className="grid w-full max-w-5xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Collections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-6">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h2 className="text-sm font-semibold">
                  {currentQuery ? `Results for "${currentQuery}"` : "Discover Images"}
                </h2>
                {/* {currentQuery && (
                  <Button variant="outline" size="sm" onClick={loadRandomImages} disabled={loading}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Show Random
                  </Button>
                )} */}
              </div>

              <div className="text-sm text-muted-foreground">{images.length} images</div>
               {currentQuery && (
                  <Button variant="outline" size="sm" onClick={loadRandomImages} disabled={loading}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Show Random
                  </Button>
                )}
            </div>

            {/* Image Grid */}
            <ImageGrid
              images={images}
              loading={loading}
              onImageClick={handleImageClick}
              onDownload={handleDownload}
              onFavorite={handleFavorite}
              favorites={favorites}
            />

            {/* Load More */}
            {images.length > 0 && !loading && (
              <div className="text-center mt-12">
                <Button onClick={loadMoreImages} disabled={searchLoading} size="lg" variant="outline">
                  {searchLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Images
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="trending">
            <TrendingSection onImageClick={handleImageClick} onCategoryClick={handleCategorySelect} />
          </TabsContent>

          <TabsContent value="collections">
            <Collections images={images} />
          </TabsContent>
        </Tabs>

        {/* Image Modal */}
        <ImageModal
          image={selectedImage}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDownload={handleDownload}
          onFavorite={handleFavorite}
          imagesPool={images}
          onOpenImage={(img) => {
            setSelectedImage(img)
            setIsModalOpen(true)
          }}
          isFavorite={selectedImage ? favorites.includes(selectedImage.id) : false}
        />
      </main>
    </div>
  )
}