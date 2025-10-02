
"use client"

import React, { useMemo, useState } from "react"
import Fuse from "fuse.js"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { UnsplashImage } from "@/lib/types"
import { Search, X } from "lucide-react"

interface SearchItem {
  id: string
  title: string
  description?: string | null
  tags: string[]
  imageThumb: string
  original: UnsplashImage
}

interface SmartSearchProps {
  images: UnsplashImage[]
  placeholder?: string
  onSelect: (image: UnsplashImage) => void
  maxResults?: number
}

/**
 * SmartSearch - fuzzy search images locally with Fuse.js
 * - searches title, description, tags, user.name
 */
export default function SmartSearch({
  images,
  placeholder = "Search images (type phrases like 'mountains sunset')",
  onSelect,
  maxResults = 8,
}: SmartSearchProps) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const list: SearchItem[] = useMemo(
    () =>
      images.map((img) => ({
        id: img.id,
        title: (img.description || img.alt_description || img.user?.name || "").trim() || "Untitled",
        description: img.description || img.alt_description || "",
        tags: Array.isArray(img.tags) ? img.tags.map((t) => (typeof t === "string" ? t : t.title || "")).filter(Boolean) : [],
        imageThumb: img.urls?.thumb || img.urls?.small || "/placeholder.svg",
        original: img,
      })),
    [images],
  )

  const fuse = useMemo(() => {
    return new Fuse(list, {
      keys: [
        { name: "title", weight: 0.6 },
        { name: "description", weight: 0.4 },
        { name: "tags", weight: 0.9 },
      ],
      includeScore: true,
      threshold: 0.45,
    })
  }, [list])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const res = fuse.search(query.trim(), { limit: maxResults }).map((r) => r.item)
    return res
  }, [fuse, query, maxResults])

  return (
    <div className="w-full max-w-3xl">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-20"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("")
              setOpen(false)
            }}
            className="absolute right-2 top-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Results dropdown */}
      {open && query.trim() && (
        <div className="mt-2 w-full rounded-lg border bg-background/95 shadow-lg z-50 p-3 max-h-80 overflow-auto">
          {results.length === 0 ? (
            <div className="text-sm text-muted-foreground">No results</div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item.original)
                    setOpen(false)
                    setQuery("")
                  }}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted transition-colors text-left"
                >
                  <div className="w-14 h-10 relative rounded overflow-hidden bg-muted flex-shrink-0">
                    <Image src={item.imageThumb} alt={item.title} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.title}</div>
                    {item.tags.length > 0 && <div className="text-xs text-muted-foreground truncate">{item.tags.slice(0, 5).join(", ")}</div>}
                  </div>
                  <div className="text-xs text-muted-foreground">view</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
