"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Heart, Info, Palette, Tag, User, Calendar, Eye } from "lucide-react"
import type { UnsplashImage, AIImageAnalysis } from "@/lib/types"
import { deepSeekAPI } from "@/lib/deepseek"
import { Skeleton } from "@/components/ui/skeleton"
import ShareDrawer from "@/components/share-dialog"
import { Share2 } from "lucide-react"
import { toast } from "sonner"
import SmartSearch from "@/components/smart-search"
import Confetti from "react-confetti"
import { useConfetti } from "@/lib/use-confetti"

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
  image, imagesPool = [], isOpen, onClose, onDownload, onFavorite, isFavorite, onOpenImage,
}: ImageModalProps) {
  const [aiAnalysis, setAiAnalysis] = useState<AIImageAnalysis | null>(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const { active, trigger } = useConfetti(8000)

  // Reset analysis
  useEffect(() => {
    if (isOpen && image) {
      setAiAnalysis(null)
      setAnalysisLoading(false)
    }
    if (!isOpen) {
      setAiAnalysis(null)
      setAnalysisLoading(false)
    }
  }, [isOpen, image])

  const handleAnalyzeImage = async () => {
    if (!image || analysisLoading) return

    try {
      setAnalysisLoading(true)
      const analysis = await deepSeekAPI.analyzeImage(image)
      setAiAnalysis(analysis)
    } catch (error) {
      console.error("Error analyzing image:", error)
      toast.error("Failed to analyze image. Please try again.")
    } finally {
      setAnalysisLoading(false)
    }
  }

const handleDownloadWithConfetti = (img: UnsplashImage) => {
    onDownload(img)
    trigger()
  }

  if (!image) return null

  return (
    <>

    {/* Confetti overlay */}
      {active && (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} />
        </div>
      )}

    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl lg:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex gap-3 items-center">
            <Info className="h-5 w-5" />
            Image Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Display */}
          <div className="space-y-4">
            <div className="relative aspect-auto rounded-lg overflow-hidden bg-muted">
              <Image
                src={image.urls.regular || "/placeholder.svg"}
                alt={image.alt_description || image.description || "Image"}
                width={image.width}
                height={image.height}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={() => {
                // onDownload(image) 
                handleDownloadWithConfetti(image)}
                } className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant={isFavorite ? "default" : "outline"}
                onClick={() => onFavorite(image)}
                className={isFavorite ? "bg-red-500 hover:bg-red-600" : ""}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-white" : ""}`} />
              </Button>
              <Button variant="outline" onClick={() => setShareOpen(true)}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>


            <div>
              <h4 className="text-sm font-medium mb-2">Find similar images</h4>
              <SmartSearch
                images={imagesPool}
                placeholder="Type to find similar images from current gallery..."
                onSelect={(img) => {
                  // open selected image in the same modal
                  onOpenImage ? onOpenImage(img) : window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                maxResults={8}
              />
            </div>
          </div>

          {/* Image Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={image.user.profile_image.medium || "/placeholder.svg"} alt={image.user.name} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{image.user.name}</p>
                    <p className="text-sm text-muted-foreground">@{image.user.username}</p>
                  </div>
                </div>

                {(image.description || image.alt_description) && (
                  <p className="text-sm">{image.description || image.alt_description}</p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {image.width} {"×"} {image.height}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>{image.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(image.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <div className="w-4 h-4 rounded border" style={{ backgroundColor: image.color }} />
                    <span>{image.color}</span>
                  </div>
                </div>

                {image.tags && image.tags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {image.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    AI Analysis
                  </h3>
                  {!aiAnalysis && (
                    <Button size="sm" variant="outline" onClick={handleAnalyzeImage} disabled={analysisLoading}>
                      {analysisLoading ? "Analyzing..." : "Analyze"}
                    </Button>
                  )}
                </div>

                {analysisLoading && (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                )}

                {aiAnalysis && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{aiAnalysis.description}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Mood</h4>
                      <Badge variant="outline">{aiAnalysis.mood}</Badge>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">AI Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {aiAnalysis.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Color Palette</h4>
                      <div className="flex gap-2">
                        {aiAnalysis.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Suggestions</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {aiAnalysis.suggestions.map((suggestion, index) => (
                          <li key={index}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <ShareDrawer isOpen={shareOpen} onClose={() => setShareOpen(false)} url={image.urls.full} />
    </>
  )
}
