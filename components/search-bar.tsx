"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, Sparkles, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IMAGE_CATEGORIES } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  onSearch: (query: string) => void
  onCategorySelect: (category: string) => void
  loading?: boolean
  suggestions?: string[]
}
interface PixelPoint {
  x: number
  y: number
  r: number
  color: string
}

// placeholder
const placeholders = [
  "Search for amazing images...",
  "Search breathtaking sunsets...",
  "Discover modern architecture...",
  "Find serene beach vibes...",
  "Explore futuristic cityscapes...",
  "Unlock abstract art wonders..."
]

export default function SearchBar({ onSearch, onCategorySelect, loading = false, suggestions = [] }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length)
    }, 3000)
    return () => clearInterval(interval)

  }, [placeholders])
  
  //effect
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const newDataRef = useRef<PixelPoint[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [animating, setAnimating] = useState(false)

  const draw = useCallback(() => {
    if (!inputRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 200
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const computedStyles = getComputedStyle(inputRef.current)
    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"))
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`
    ctx.fillStyle = "#FFF"
    ctx.fillText(query, 16, 40)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixelData = imageData.data
    const newData: PixelPoint[]= []

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4
        if (pixelData[index + 3] > 0) {
          newData.push({
            x,
            y,
            r: 1,
            color: `rgba(${pixelData[index]}, ${pixelData[index + 1]}, ${pixelData[index + 2]}, ${pixelData[index + 3]})`
          })
        }
      }
    }
    newDataRef.current = newData
  }, [query])

  const animate = (start: number) => {
    const animateFrame = (pos = start) => {
      requestAnimationFrame(() => {
        const newArr: PixelPoint[] = []
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i]
          if (current.r <= 0) continue
          current.x += Math.random() > 0.5 ? 1 : -1
          current.y += Math.random() > 0.5 ? 1 : -1
          current.r -= 0.05 * Math.random()
          newArr.push(current)
        }
        newDataRef.current = newArr
        const ctx = canvasRef.current?.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, 800, 200)
          newDataRef.current.forEach((p) => {
            ctx.beginPath()
            ctx.rect(p.x, p.y, p.r, p.r)
            ctx.fillStyle = p.color
            ctx.fill()
          })
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8)
        } else {
          setQuery("")
          setAnimating(false)
        }
      })
    }
    animateFrame(start)
  }

  const vanishAndSubmit = () => {
    setAnimating(true)
    draw()
    if (query) {
      const maxX = newDataRef.current.reduce((prev, current) => (current.x > prev ? current.x : prev), 0)
      animate(maxX)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    // if (query.trim()) {
     vanishAndSubmit()
      onSearch(query.trim())
      setShowSuggestions(false)
    // }
  }

  const handleClear = () => {
    setQuery("")
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    onSearch(suggestion)
    setShowSuggestions(false)
  }

   useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) {
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          {/* Canvas vanish overlay */}
          <canvas
            className={cn(
              "absolute pointer-events-none text-base transform scale-50 top-[20%] left-2 sm:left-8 origin-top-left filter invert dark:invert-0 pr-20",
              !animating ? "opacity-0" : "opacity-100"
            )}
            ref={canvasRef}
          />

          <Input
            ref={inputRef}
            type="text"
            placeholder=""
            value={query}
            disabled={loading}
            onChange={(e) => !animating && setQuery(e.target.value)}
            className={cn(
              "w-full pl-12 pr-24 h-14 text-lg bg-background/60 backdrop-blur-sm border-1 focus:border-primary/50 transition-colors rounded-2xl relative",
              animating && "text-transparent"
            )}
          />

          {/* Placeholder flipping animation */}
          <div className="absolute inset-0 flex items-center pointer-events-none pl-12">
            <AnimatePresence mode="wait">
              {!query && !animating && (
                <motion.span
                  key={currentPlaceholder}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-muted-foreground text-base truncate"
                >
                  {placeholders[currentPlaceholder]}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {query && (
              <Button type="button" variant="ghost" size="sm" onClick={handleClear} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={loading || !query.trim()}
              className={`bg-[#000] text-[#fff] dark:bg-[#fff] dark:text-[#000] w-12 h-12 accent-sidebar-border border-[#000] dark:border-[#fff] rounded-xl`}
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 dark:border-black border-white border-t-transparent" />
              ) : (
                <ArrowRight />
              )}
            </Button>
          </div>
        </div>

        {/* AI Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg z-50 p-4 h-40">
            <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Suggestions for you
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {IMAGE_CATEGORIES.map((category) => (
          <Badge
            key={category}
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors capitalize px-4 py-2"
            onClick={() => onCategorySelect(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  )
}