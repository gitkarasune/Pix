"use client"

import { useState, useEffect } from "react"
import DashboardHeader from "@/components/dashboard-header"
import ImageGrid from "@/components/image-grid"
import type { UnsplashImage } from "@/lib/types"
import { unsplashAPI } from "@/lib/unsplash"
import { Button } from "@/components/ui/button"
import { Heart, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function FavoritesPage() {
  const [favoriteImages, setFavoriteImages] = useState<UnsplashImage[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const savedFavorites = localStorage.getItem("pixelvault-favorites")
      const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : []
      setFavorites(favoriteIds)

      if (favoriteIds.length === 0) {
        setFavoriteImages([])
        return
      }

      // Load favorite images
      const images = await Promise.all(
        favoriteIds.map(async (id: string) => {
          try {
            return await unsplashAPI.getPhotoById(id)
          } catch (error) {
            console.error(`Error loading image ${id}:`, error)
            return null
          }
        }),
      )

      setFavoriteImages(images.filter(Boolean) as UnsplashImage[])
    } catch (error) {
      console.error("Error loading favorites:", error)
      toast.error( "Failed to load favorite images.")
    } finally {
      setLoading(false)
    }
  }

  const handleImageClick = (image: UnsplashImage) => {
    window.open(image.links.html, "_blank")
  }

  const handleDownload = async (image: UnsplashImage) => {
    try {
      await unsplashAPI.downloadPhoto(image.links.download_location)

      const link = document.createElement("a")
      link.href = image.urls.full
      link.download = `pixelvault-${image.id}.jpg`
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Your image is being downloaded.")
    } catch (error) {
      console.error("Error downloading image:", error)
      toast.error("Failed to download image. Please try again.")
    }
  }

  const handleFavorite = (image: UnsplashImage) => {
    const newFavorites = favorites.filter((id) => id !== image.id)
    setFavorites(newFavorites)
    setFavoriteImages((prev) => prev.filter((img) => img.id !== image.id))
    localStorage.setItem("pixelvault-favorites", JSON.stringify(newFavorites))

    toast.success( "Image removed from your favorites.")
  }

  const clearAllFavorites = () => {
    setFavorites([])
    setFavoriteImages([])
    localStorage.removeItem("pixelvault-favorites")

    toast.success("All favorite images have been removed.")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              Your Favorites
            </h1>
            <p className="text-muted-foreground">
              {favoriteImages.length === 0
                ? "You haven't saved any favorite images yet."
                : `${favoriteImages.length} favorite image${favoriteImages.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {favoriteImages.length > 0 && (
            <Button
              variant="outline"
              onClick={clearAllFavorites}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 bg-transparent"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {favoriteImages.length === 0 && !loading ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6">
              Start exploring images and click the heart icon to save your favorites here.
            </p>
            <Button asChild>
              <a href="/dashboard">Browse Gallery</a>
            </Button>
          </div>
        ) : (
          <ImageGrid
            images={favoriteImages}
            loading={loading}
            onImageClick={handleImageClick}
            onDownload={handleDownload}
            onFavorite={handleFavorite}
            favorites={favorites}
          />
        )}
      </main>
    </div>
  )
}
