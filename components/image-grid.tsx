"use client"

import { useState } from "react"
import Image from "next/image"
import { Download, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { UnsplashImage } from "@/lib/types"
import { cn } from "@/lib/utils"
import Confetti from "react-confetti"
import { useConfetti } from "@/lib/use-confetti"

interface ImageGridProps {
  images: UnsplashImage[]
  loading?: boolean
  onImageClick?: (image: UnsplashImage) => void
  onDownload?: (image: UnsplashImage) => void
  onFavorite?: (image: UnsplashImage) => void
  favorites?: string[]
}

export default function ImageGrid({
  images,
  loading = false,
  onImageClick,
  onDownload,
  onFavorite,
  favorites = [],
}: ImageGridProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const { active, trigger } = useConfetti(8000)

  const handleImageLoad = (imageId: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageId))
  }

  if (loading) {
    return <ImageGridSkeleton />
  }

  const handleDownloadWithConfetti = (img: UnsplashImage) => {
      onDownload?.(img)
      trigger()
    }

  return (
    <>

    {/* Confetti overlay */}
          {active && (
            <div className="fixed inset-0 pointer-events-none z-[9999]">
              <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} />
            </div>
          )}

    <div className="masonry-grid">
      {images.map((image) => (
        <div key={image.id} className="masonry-item">
          <Card className="group overflow-hidden border-0 bg-background/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="relative aspect-auto">
              <div
                className={cn(
                  "relative overflow-hidden rounded-lg cursor-pointer",
                  !loadedImages.has(image.id) && "animate-pulse bg-muted",
                )}
                onClick={() => onImageClick?.(image)}
              >
                <Image
                  src={image.urls.small || "/placeholder.svg"}
                  alt={image.alt_description || image.description || "Unsplash image"}
                  width={image.width}
                  height={image.height}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  onLoad={() => handleImageLoad(image.id)}
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      onFavorite?.(image)
                    }}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        favorites.includes(image.id) ? "fill-red-500 text-red-500" : "text-gray-600",
                      )}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      // onDownload?.(image)
                      handleDownloadWithConfetti(image)
                    }}
                  >
                    <Download className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <Image
                        src={image.user.profile_image.small || "/placeholder.svg"}
                        alt={image.user.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="text-sm font-medium">{image.user.name}</span>
                    </div>
                    {/* <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(image.links.html, "_blank")
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Image metadata */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {image.width} × {image.height}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Heart className="h-3 w-3" />
                  {image.likes}
                </div>
              </div>

              {(image.description || image.alt_description) && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {image.description || image.alt_description}
                </p>
              )}

              {image.tags && image.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {image.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                      {tag.title}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      ))}
    </div>

    </>
  )
}

function ImageGridSkeleton() {
  return (
    <div className="masonry-grid">
      {Array.from({ length: 20 }).map((_, index) => (
        <div key={index} className="masonry-item">
          <Card className="overflow-hidden">
            <Skeleton className={cn("w-full", index % 3 === 0 ? "h-64" : index % 3 === 1 ? "h-80" : "h-72")} />
            <div className="p-3 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
