"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Calendar, Users, Zap } from "lucide-react"
import type { UnsplashImage } from "@/lib/types"
import { unsplashAPI } from "@/lib/unsplash"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { ReactNode } from 'react'

interface TrendingSectionProps {
  onImageClick: (image: UnsplashImage) => void
  onCategoryClick: (category: string) => void
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
    />

    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
  </div>
)

export default function TrendingSection({ onImageClick, onCategoryClick }: TrendingSectionProps) {
  const [trendingImages, setTrendingImages] = useState<UnsplashImage[]>([])
  const [loading, setLoading] = useState(true)

  const trendingCategories = [
    { name: "AI & Technology", query: "artificial intelligence technology", color: "bg-blue-500" },
    { name: "Nature & Landscapes", query: "nature landscape mountains", color: "bg-green-500" },
    { name: "Architecture", query: "modern architecture buildings", color: "bg-purple-500" },
    { name: "Abstract Art", query: "abstract art colorful", color: "bg-pink-500" },
    { name: "Business & Work", query: "business office workspace", color: "bg-orange-500" },
    { name: "Food & Lifestyle", query: "food lifestyle cooking", color: "bg-red-500" },
  ]

  useEffect(() => {
    loadTrendingImages()
  }, [])

  const loadTrendingImages = async () => {
    try {
      setLoading(true)
      // Get trending images by searching for popular terms
      const trendingQueries = ["trending", "popular", "featured", "editorial"]
      const randomQuery = trendingQueries[Math.floor(Math.random() * trendingQueries.length)]

      const searchResults = await unsplashAPI.searchPhotos(randomQuery, 1, 12)
      setTrendingImages(searchResults.results)
    } catch (error) {
      console.error("Error loading trending images:", error)
      // Fallback to random images
      try {
        const randomImages = await unsplashAPI.getRandomPhotos(12)
        setTrendingImages(randomImages)
      } catch (fallbackError) {
        console.error("Error loading fallback images:", fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Trending Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {trendingCategories.map((category, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2 hover:shadow-md transition-shadow bg-transparent"
                onClick={() => onCategoryClick(category.query)}
              >
                <div className={`w-8 h-8 rounded-full ${category.color} flex items-center justify-center`}>
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-left">{category.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending Images */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Trending This Week
          </CardTitle>
          <Button variant="outline" size="sm" onClick={loadTrendingImages} disabled={loading}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trendingImages.slice(0, 8).map((image) => (
                <div key={image.id} className="group cursor-pointer space-y-2" onClick={() => onImageClick(image)}>
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={image.urls.small || "/placeholder.svg"}
                      alt={image.alt_description || "Trending image"}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium line-clamp-1">
                      {image.description || image.alt_description || "Untitled"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{image.likes} likes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-6">
            <CardDecorator>
              <div className="text-2xl font-bold text-blue-600">10M+</div>
            </CardDecorator>
              <div className="text-sm text-muted-foreground">Images Available</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <CardDecorator>
              <div className="text-2xl font-bold text-green-600">500K+</div>
            </CardDecorator>
              <div className="text-sm text-muted-foreground">Active Users</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <CardDecorator>
              <div className="text-2xl font-bold text-purple-600">1M+</div>
            </CardDecorator>
              <div className="text-sm text-muted-foreground">Downloads Daily</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
