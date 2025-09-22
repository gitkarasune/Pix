import Logo from "@/components/logo"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart } from "lucide-react"

export default function FavoritesLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Logo />
            <div className="hidden md:flex items-center gap-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500 animate-pulse" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Favorites Grid Skeleton */}
        <div className="masonry-grid">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="masonry-item">
              <div className="overflow-hidden rounded-lg border bg-card">
                <Skeleton className={`w-full ${index % 3 === 0 ? "h-64" : index % 3 === 1 ? "h-80" : "h-72"}`} />
                <div className="p-3 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex gap-1">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        <div className="text-center mt-12">
          <div className="flex items-center justify-center gap-2">
            <Logo />
            <span className="text-muted-foreground">Loading your favorites...</span>
          </div>
        </div>
      </main>
    </div>
  )
}
