"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  Download,
  Heart,
  Info,
  Palette,
  Tag,
  User,
  Calendar,
  Eye,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import type { UnsplashImage } from "@/lib/types"
import ShareDrawer from "@/components/share-dialog"
import { Share2 } from "lucide-react"
import SmartSearch from "@/components/smart-search"
import Confetti from "react-confetti"
import { useConfetti } from "@/lib/use-confetti"
import SubscriptionDialog from "./subscription-dialog"
import { motion, AnimatePresence } from "framer-motion"
import ColorPaletteExtractor from "./color-palette-extractor"

interface ImageModalProps {
  image: UnsplashImage | null
  imagesPool: UnsplashImage[]
  isOpen: boolean
  onClose: () => void
  onDownload: (image: UnsplashImage) => void
  onFavorite: (image: UnsplashImage) => void
  isFavorite: boolean
  onOpenImage?: (image: UnsplashImage) => void
}

export default function ImageModal({
  image,
  imagesPool = [],
  isOpen,
  onClose,
  onDownload,
  onFavorite,
  isFavorite,
  onOpenImage,
}: ImageModalProps) {
  // current image state (no history)
  const [currentImage, setCurrentImage] = useState<UnsplashImage | null>(image)

  // sidebar state for related images
  const [relatedOpen, setRelatedOpen] = useState(false)

  // other modals / drawers
  const [shareOpen, setShareOpen] = useState(false)
  const { active, trigger } = useConfetti(8000)
  // const [isChatOpen, setIsChatOpen] = useState(false)
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false)
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false)


  const mountedRef = useRef(false)

  // Reset currentImage when modal opens with new image
  useEffect(() => {
    if (image) {
      setCurrentImage(image)
    } else {
      setCurrentImage(null)
    }
    // intentionally not adding imagesPool or others to avoid unwanted resets
    /// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, isOpen])

  // confetti download wrapper
  const handleDownloadWithConfetti = useCallback(
    (img: UnsplashImage) => {
      onDownload(img)
      trigger()
    },
    [onDownload, trigger],
  )

  // Derive related images (simple scoring + fallback). Returns up to N candidates.
  const getRelated = useCallback(
    (pool: UnsplashImage[], current: UnsplashImage | null, limit = 6) => {
      if (!current || pool.length === 0) return []
      const tagSet = new Set<string>()
      if (Array.isArray(current.tags)) {
        current.tags.forEach((t) => {
          if (typeof t === "string") tagSet.add(t)
          else if (t && typeof t.title === "string") tagSet.add(t.title)
        })
      }  

      const candidates = pool
        .filter((p) => p.id !== current.id)
        .map((p) => {
          let score = 0
          // same author boost
          if (p.user?.username && current.user?.username && p.user.username === current.user.username) score += 3
          // tag overlap
          if (Array.isArray(p.tags)) {
            const pTags = p.tags.map((t) => (typeof t === "string" ? t : t.title || "")).filter(Boolean)
            const overlap = pTags.filter((t) => tagSet.has(t)).length
            score += overlap * 2
          }
          // small likes heuristic
          score += Math.min(2, Math.round((p.likes ?? 0) / 100))
          return { item: p, score }
        })

      candidates.sort((a, b) => b.score - a.score)
      const top = candidates.slice(0, limit).map((c) => c.item)
      if (top.length >= limit) return top

      // fill with random unique items
      const used = new Set(top.map((t) => t.id))
      used.add(current.id)
      const remaining = pool.filter((p) => !used.has(p.id))
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[remaining[i], remaining[j]] = [remaining[j], remaining[i]]
      }
      return [...top, ...remaining.slice(0, limit - top.length)]
    },
    [],
  )

  const related = getRelated(imagesPool, currentImage, 6)

  // Arrow navigation: move to prev/next in imagesPool (wrap)
  const navigatePool = useCallback(
    (direction: "prev" | "next") => {
      if (!currentImage || imagesPool.length === 0) return
      const idx = imagesPool.findIndex((p) => p.id === currentImage.id)
      if (idx === -1) return
      const nextIdx = direction === "next" ? (idx + 1) % imagesPool.length : (idx - 1 + imagesPool.length) % imagesPool.length
      const next = imagesPool[nextIdx]
      if (!next) return
      // preserve parent behavior
      if (onOpenImage) {
        onOpenImage(next)
      } else {
        setCurrentImage(next)
      }
    },
    [currentImage, imagesPool, onOpenImage],
  )

  // keyboard navigation for chevrons: left/right arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === "ArrowLeft") navigatePool("prev")
      if (e.key === "ArrowRight") navigatePool("next")
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, navigatePool])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  if (!currentImage) return null
  if (!image) return null

  return (
    <>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          <Confetti width={typeof window !== "undefined" ? window.innerWidth : 1200} height={typeof window !== "undefined" ? window.innerHeight : 800} recycle={false} numberOfPieces={500} />
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-3xl lg:max-w-[90rem] max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex gap-3 items-center">
              <Info className="h-5 w-5" />
              Image Details
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: image + controls */}
            <div className="space-y-4">
              <div className="relative aspect-auto rounded-lg overflow-hidden bg-muted">
                {/* overlay arrows for desktop */}
                <div className="absolute inset-0 z-20 flex items-center justify-between px-3 pointer-events-none">
                  <div className="hidden lg:flex pointer-events-auto">
                    <Button onClick={() => navigatePool("prev")} variant="ghost" size="lg" className="bg-white/70 hover:bg-white p-3 w-10 rounded-full"> 
                      <ChevronLeft />
                    </Button>
                  </div>
                  <div className="hidden lg:flex pointer-events-auto">
                    <Button onClick={() => navigatePool("next")} variant="ghost" size="lg" className="bg-white/70 hover:bg-white p-3 w-10 rounded-full"> 
                      <ChevronRight />
                    </Button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImage.id}
                    initial={{ opacity: 0, scale: 0.995 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.995 }}
                    transition={{ duration: 0.22 }}
                    className="w-full"
                  >
                    <Image
                      src={currentImage.urls.regular || "/placeholder.png"}
                      alt={currentImage.alt_description || currentImage.description || "Image"}
                      width={currentImage.width}
                      height={currentImage.height}
                      className="w-full h-auto object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* buttons */}
              <div className="flex gap-2">
                <Button onClick={() => handleDownloadWithConfetti(currentImage)} className="flex-1">
                  <Download className="h-5 w-5 mr-2" />
                  Download
                </Button>

                <Button
                  variant={isFavorite ? "default" : "outline"}
                  onClick={() => onFavorite(currentImage)}
                  className={isFavorite ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-white" : ""}`} />
                </Button>

                <Button variant="outline" onClick={() => setShareOpen(true)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* SmartSearch: visible below image only on small/med, hidden on large */}
              <div className="lg:hidden">
                <h4 className="text-sm font-medium mb-2">Find similar images</h4>
                <SmartSearch
                  images={imagesPool}
                  placeholder="Type to find similar images from current gallery..."
                  onSelect={(img) => {
                    if (onOpenImage) onOpenImage(img)
                    else setCurrentImage(img)
                  }}
                  maxResults={8}
                />
              </div>
            </div>

            {/* RIGHT: metadata, remix/chat, related (related visible on large in-card + expand) */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={currentImage.user.profile_image.medium || "/placeholder.svg"} alt={currentImage.user.name} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{currentImage.user.name}</p>
                      <p className="text-sm text-muted-foreground">@{currentImage.user.username}</p>
                    </div>
                  </div>

                  {(currentImage.description || currentImage.alt_description) && (
                    <p className="text-sm">{currentImage.description || currentImage.alt_description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {currentImage.width} {"×"} {currentImage.height}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span>{currentImage.likes} likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(currentImage.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <div className="w-4 h-4 rounded border" style={{ backgroundColor: currentImage.color }} />
                      <span>{currentImage.color}</span>
                    </div>
                  </div>

                  {currentImage.tags && currentImage.tags.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {currentImage.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {typeof tag === "string" ? tag : tag.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                  <Button
                  variant="secondary"
                  onClick={() => {
                    setIsColorPaletteOpen(true)
                    onClose()
                  }}
                  className="w-full"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Colors
                </Button>
                    <Button
                      
                      onClick={() => {
                        // open the subscription drawer when "Chat About Image" is clicked
                        setIsSubscriptionOpen(true)
                      }}
                      className="w-full"
                    >
                      <MessageSquare className="h-6 w-6 mr-2" />
                      Chat About Image
                    </Button>
                  </div>

                  {/* Related images grid (large screens) */}
                  <div className="hidden lg:block mt-4">
                    <h4 className="text-sm font-medium mb-2">Related images</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {related.slice(0, 6).map((r) => (
                        <button
                          key={r.id}
                          onClick={() => {
                            if (onOpenImage) onOpenImage(r)
                            else setCurrentImage(r)
                          }}
                          className="rounded overflow-hidden group relative h-28 sm:h-32"
                        >
                          <motion.div whileHover={{ scale: 1.03 }} className="w-full h-full">
                            <Image
                              src={r.urls.small || r.urls.thumb || "/placeholder.png"}
                              alt={r.alt_description || r.description || "Related"}
                              fill
                              style={{ objectFit: "cover" }}
                              className="rounded"
                            />
                          </motion.div>
                        </button>
                      ))}
                    </div>

                    {/* Expand button under related images */}
                    <div className="flex justify-center mt-3">
                      <Button variant="ghost" onClick={() => setRelatedOpen(true)}>
                        Show all related
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* RIGHT-SIDEBAR (related gallery) - does not close main modal */}
      <AnimatePresence>
        {relatedOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed top-0 right-0 h-full z-[60] bg-background/95 shadow-xl border-l w-full sm:w-[70%] md:w-[55%] lg:w-[38%] overflow-y-auto"
          >
            <div className="p-4 sticky top-0 bg-background/95 z-10 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">All related images</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setRelatedOpen(false)}>Close</Button>
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-scroll">
              {getRelated(imagesPool, currentImage, 200).map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    // on selecting an image in sidebar: close sidebar and set main image
                    setRelatedOpen(false)
                    if (onOpenImage) onOpenImage(r)
                    else setCurrentImage(r)
                  }}
                  className="rounded overflow-hidden relative h-40 sm:h-44"
                >
                  <Image
                    src={r.urls.small || r.urls.thumb || "/placeholder.png"}
                    alt={r.alt_description || r.description || "Related"}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded"
                  />
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* chat */}
      {/* <ImageChatSidebar image={currentImage} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} /> */}

      {/* share drawer */}
      <ShareDrawer isOpen={shareOpen} onClose={() => setShareOpen(false)} url={currentImage.urls.full} />

      {/* subscription drawer */}
      <SubscriptionDialog open={isSubscriptionOpen} onOpenChange={(open: boolean) => setIsSubscriptionOpen(open)} />


        {/* Color Palette Extractor */}
      <ColorPaletteExtractor image={currentImage} isOpen={isColorPaletteOpen} onClose={() => setIsColorPaletteOpen(false)} />
    </>
  )
}
