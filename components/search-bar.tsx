// "use client"

// import type React from "react"

// import { useState, useEffect, useRef, useCallback, useMemo } from "react"eact"
// import { Search, X, Sparkles, ArrowRight, Copy as CopyIcon } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { IMAGE_CATEGORIES } from "@/lib/constants"
// import { cn } from "@/lib/utils"
// import { deepSeekAPI } from "@/lib/deepseek"
// import { toast } from "sonner"

// interface SearchBarProps {
//   onSearch: (query: string) => void
//   onCategorySelect: (category: string) => void
//   loading?: boolean
//   suggestions?: string[]
// }
// interface PixelPoint {
//   x: number
//   y: number
//   r: number
//   color: string
// }

// // placeholder
// const placeholders = [
//   "Search for amazing images...",
//   "Search breathtaking sunsets...",
//   "Discover modern architecture...",
//   "Find serene beach vibes...",
//   "Explore futuristic cityscapes...",
//   "Unlock abstract art wonders..."
// ]

// export default function SearchBar({ onSearch, onCategorySelect, loading = false, suggestions = [] }: SearchBarProps) {
//   const [query, setQuery] = useState("")
//   const [showSuggestions, setShowSuggestions] = useState(false)
//   const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([])
//   const [recentSearches, setRecentSearches] = useState<string[]>(() => {
//     if (typeof window === "undefined") return []
//     try {
//       return JSON.parse(localStorage.getItem("pix-searches") || "[]")
//     } catch {
//       return []
//     }
//   })
  
//   const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length)
//     }, 3000)
//     return () => clearInterval(interval)

//   }, [])
  
//   //effect
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const newDataRef = useRef<PixelPoint[]>([])
//   const inputRef = useRef<HTMLInputElement>(null)
//   const [animating, setAnimating] = useState(false)

//   const draw = useCallback(() => {
//     if (!inputRef.current) return
//     const canvas = canvasRef.current
//     if (!canvas) return
//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     canvas.width = 800
//     canvas.height = 200
//     ctx.clearRect(0, 0, canvas.width, canvas.height)

//     const computedStyles = getComputedStyle(inputRef.current)
//     const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"))
//     ctx.font = `${Math.max(16, fontSize * 2)}px ${computedStyles.fontFamily}`
//     ctx.fillStyle = "#FFF"
//     ctx.fillText(query, 16, 40)

//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
//     const pixelData = imageData.data
//     const newData: PixelPoint[]= []

//     for (let y = 0; y < canvas.height; y++) {
//       for (let x = 0; x < canvas.width; x++) {
//         const index = (y * canvas.width + x) * 4
//         if (pixelData[index + 3] > 0) {
//           newData.push({
//             x,
//             y,
//             r: 1,
//             color: `rgba(${pixelData[index]}, ${pixelData[index + 1]}, ${pixelData[index + 2]}, ${pixelData[index + 3]})`
//           })
//         }
//       }
//     }
//     newDataRef.current = newData
//   }, [query])

//   const animate = (start: number) => {
//     const animateFrame = (pos = start) => {
//       requestAnimationFrame(() => {
//         const newArr: PixelPoint[] = []
//         for (let i = 0; i < newDataRef.current.length; i++) {
//           const current = newDataRef.current[i]
//           if (current.r <= 0) continue
//           current.x += Math.random() > 0.5 ? 1 : -1
//           current.y += Math.random() > 0.5 ? 1 : -1
//           current.r -= 0.05 * Math.random()
//           newArr.push(current)
//         }
//         newDataRef.current = newArr
//         const ctx = canvasRef.current?.getContext("2d")
//         if (ctx) {
//           ctx.clearRect(0, 0, 800, 200)
//           newDataRef.current.forEach((p) => {
//             ctx.beginPath()
//             ctx.rect(p.x, p.y, p.r, p.r)
//             ctx.fillStyle = p.color
//             ctx.fill()
//           })
//         }
//         if (newDataRef.current.length > 0) {
//           animateFrame(pos - 8)
//         } else {
//           setQuery("")
//           setAnimating(false)
//         }
//       })
//     }
//     animateFrame(start)
//   }

//   const vanishAndSubmit = () => {
//     setAnimating(true)
//     draw()
//     if (query) {
//       const maxX = newDataRef.current.reduce((prev, current) => (current.x > prev ? current.x : prev), 0)
//       animate(maxX)
//     }
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!query.trim()) return
//     // if (query.trim()) {
//      vanishAndSubmit()
//       onSearch(query.trim())
//       setShowSuggestions(false)
//     // }
//   }

//   const handleClear = () => {
//     setQuery("")
//     setShowSuggestions(false)
//   }

//   const handleSuggestionClick = (suggestion: string) => {
//     setQuery(suggestion)
//     onSearch(suggestion)
//     setShowSuggestions(false)
//   }

//    useEffect(() => {
//     const timer = setTimeout(async () => {
//       if (query.length > 2) {
//         try {
//           const results = await deepSeekAPI.generateSearchSuggestions(query)
//           if (results.length > 0) {
//             setShowSuggestions(true)
//             setDynamicSuggestions(results)
//           }
//         } catch (err) {
//           console.log("Suggestion error:", err);
//         }
//       } else {
//         setShowSuggestions(false)
//       }
//     }, 400)

//     return () => clearTimeout(timer)
//   }, [query])

//   return (
//     <div className="w-full max-w-6xl mx-auto space-y-6">
//       {/* Search Input */}
//       <form onSubmit={handleSubmit} className="relative">
//         <div className="relative">
//           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
//           {/* Canvas vanish overlay */}
//           <canvas
//             className={cn(
//               "absolute pointer-events-none text-base transform scale-50 top-[20%] left-2 sm:left-8 origin-top-left filter invert dark:invert-0 pr-20",
//               !animating ? "opacity-0" : "opacity-100"
//             )}
//             ref={canvasRef}
//           />

//           <Input
//             ref={inputRef}
//             type="text"
//             placeholder=""
//             value={query}
//             disabled={loading}
//             onChange={(e) => !animating && setQuery(e.target.value)}
//             className={cn(
//               "w-full pl-12 pr-24 h-14 text-lg bg-background/60 backdrop-blur-sm border-1 focus:border-primary/50 transition-colors rounded-2xl relative",
//               animating && "text-transparent"
//             )}
//           />

//           {/* Placeholder flipping animation */}
//           <div className="absolute inset-0 flex items-center pointer-events-none pl-12">
//             <AnimatePresence mode="wait">
//               {!query && !animating && (
//                 <motion.span
//                   key={currentPlaceholder}
//                   initial={{ y: 10, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   exit={{ y: -10, opacity: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="text-muted-foreground text-base truncate"
//                 >
//                   {placeholders[currentPlaceholder]}
//                 </motion.span>
//               )}
//             </AnimatePresence>
//           </div>

//           <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
//             {query && (
//               <Button type="button" variant="ghost" size="sm" onClick={handleClear} className="h-8 w-8 p-0">
//                 <X className="h-4 w-4" />
//               </Button>
//             )}
//             <Button
//               type="submit"
//               size="sm"
//               disabled={loading || !query.trim()}
//               className={`bg-[#000] text-[#fff] dark:bg-[#fff] dark:text-[#000] w-12 h-12 accent-sidebar-border border-[#000] dark:border-[#fff] rounded-xl`}
//             >
//               {loading ? (
//                 <div className="h-4 w-4 animate-spin rounded-full border-2 dark:border-black border-white border-t-transparent" />
//               ) : (
//                 <ArrowRight />
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* AI Suggestions */}
//         {showSuggestions && dynamicSuggestions.length > 0 && (
//           <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg z-50 p-4 h-40">
//             <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
//               <Sparkles className="h-4 w-4" />
//               AI Suggestions for you
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {dynamicSuggestions.map((suggestion, index) => (
//                 <Badge
//                   key={index}
//                   variant="secondary"
//                   className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
//                   onClick={() => handleSuggestionClick(suggestion)}
//                 >
//                   {suggestion}
//                 </Badge>
//               ))}
//             </div>
//           </div>
//         )}
//       </form>

//       {/* Category Pills */}
//       <div className="flex flex-wrap gap-2 justify-center">
//         {IMAGE_CATEGORIES.map((category) => (
//           <Badge
//             key={category}
//             variant="outline"
//             className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors capitalize px-4 py-2"
//             onClick={() => onCategorySelect(category)}
//           >
//             {category}
//           </Badge>
//         ))}
//       </div>
//     </div>
//   )
// }





"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Search, X, Sparkles, ArrowRight, Copy as CopyIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IMAGE_CATEGORIES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { deepSeekAPI } from "@/lib/deepseek"
import { toast } from "sonner"

interface SearchBarProps {
  onSearch: (query: string) => void
  onCategorySelect: (category: string) => void
  loading?: boolean
  suggestions?: string[] // optional static suggestions to merge with AI ones
}

interface PixelPoint {
  x: number
  y: number
  r: number
  color: string
}

const placeholders = [
  "Search for amazing images...",
  "Search breathtaking sunsets...",
  "Discover modern architecture...",
  "Find serene beach vibes...",
  "Explore futuristic cityscapes...",
  "Unlock abstract art wonders..."
]

export default function SearchBar({
  onSearch,
  onCategorySelect,
  loading = false,
  suggestions = [],
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  // dynamic / AI suggestions + recent searches
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return []
    try {
      return JSON.parse(localStorage.getItem("pix-searches") || "[]")
    } catch {
      return []
    }
  })

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // vanish/canvas pieces
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

    // fit canvas to a smaller drawing area for performance
    canvas.width = 800
    canvas.height = 200
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const computedStyles = getComputedStyle(inputRef.current)
    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"))
    ctx.font = `${Math.max(16, fontSize * 2)}px ${computedStyles.fontFamily}`
    ctx.fillStyle = "#FFF"
    ctx.fillText(query, 16, 40)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixelData = imageData.data
    const newData: PixelPoint[] = []

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4
        if (pixelData[index + 3] > 0) {
          newData.push({
            x,
            y,
            r: 1,
            color: `rgba(${pixelData[index]}, ${pixelData[index + 1]}, ${pixelData[index + 2]}, ${pixelData[index + 3]})`,
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
    vanishAndSubmit()
    pushToRecent(query.trim())
    onSearch(query.trim())
    setShowSuggestions(false)
  }

  const handleClear = () => {
    setQuery("")
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    pushToRecent(suggestion)
    onSearch(suggestion)
    setShowSuggestions(false)
  }

  // suggestion caching
  const cacheRef = useRef<Map<string, string[]>>(new Map())

  // fetch dynamic suggestions (debounced)
  useEffect(() => {
    let mounted = true
    const q = query.trim()
    const timer = setTimeout(async () => {
      if (!q || q.length <= 2) {
        if (mounted) {
          setDynamicSuggestions([])
          // only show recent searches (if any) when query empty
          setShowSuggestions(q.length > 2 ? true : recentSearches.length > 0)
        }
        return
      }

      // cached?
      if (cacheRef.current.has(q)) {
        if (mounted) {
          setDynamicSuggestions(cacheRef.current.get(q) || [])
          setShowSuggestions(true)
        }
        return
      }

      try {
        const res = await deepSeekAPI.generateSearchSuggestions(q)
        if (!mounted) return
        const arr = Array.isArray(res) ? res : []
        cacheRef.current.set(q, arr)
        setDynamicSuggestions(arr)
        setShowSuggestions(true)
      } catch (err) {
        console.error("Suggestion error:", err)
        if (mounted) {
          setDynamicSuggestions([])
          setShowSuggestions(false)
        }
      }
    }, 350)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
    // don't include deepSeekAPI in deps (module static)
  }, [query, recentSearches])

  // merged suggestions (deduped): dynamic first, then prop suggestions, then recent
  const mergedSuggestions = useMemo(() => {
    const set = new Set<string>()
    ;(dynamicSuggestions || []).forEach((s) => set.add(s))
    ;(suggestions || []).forEach((s) => set.add(s))
    ;(recentSearches || []).forEach((s) => set.add(s))
    return Array.from(set)
  }, [dynamicSuggestions, suggestions, recentSearches])

  // keyboard nav
  const [activeIndex, setActiveIndex] = useState(-1)

  const selectSuggestion = (index: number) => {
    const s = mergedSuggestions[index]
    if (!s) return
    handleSuggestionClick(s)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || mergedSuggestions.length === 0) {
      if (e.key === "Enter") {
        // no suggestions visible, submit normally
        if (query.trim()) {
          handleSubmit(e as unknown as React.FormEvent)
        }
      }
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => Math.min(prev + 1, mergedSuggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (activeIndex >= 0) {
        selectSuggestion(activeIndex)
        setActiveIndex(-1)
      } else {
        // submit typed query
        if (query.trim()) {
          handleSubmit(e as unknown as React.FormEvent)
        }
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setActiveIndex(-1)
    }
  }

  // recent searches management
  const pushToRecent = (s: string) => {
    try {
      const arr = [s, ...(recentSearches.filter((r) => r !== s))].slice(0, 10)
      setRecentSearches(arr)
      localStorage.setItem("pix-searches", JSON.stringify(arr))
    } catch {
      /* ignore */
    }
  }

  const clearRecent = () => {
    setRecentSearches([])
    localStorage.removeItem("pix-searches")
    toast.success("Search history cleared")
  }

  // click outside / blur handling to hide suggestions (small delay to allow clicks)
  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [])

  // highlight matched substring
  const highlightMatch = (text: string, q: string) => {
    if (!q) return <>{text}</>
    const lower = text.toLowerCase()
    const qLower = q.toLowerCase()
    const idx = lower.indexOf(qLower)
    if (idx === -1) return <>{text}</>
    const before = text.slice(0, idx)
    const match = text.slice(idx, idx + q.length)
    const after = text.slice(idx + q.length)
    return (
      <>
        {before}
        <span className="bg-yellow-200/70 dark:bg-yellow-600/40 rounded px-[2px]">{match}</span>
        {after}
      </>
    )
  }

  // copy suggestion to clipboard
  const copyToClipboard = async (s: string) => {
    try {
      await navigator.clipboard.writeText(s)
      toast.success("Copied suggestion!")
    } catch {
      toast.error("Copy failed")
    }
  }

  const mergedSuggestionsKey = useMemo(() => mergedSuggestions.join("|"), [mergedSuggestions]) 

  // ensure activeIndex resets when suggestions update
  useEffect(() => {
    setActiveIndex(-1)

  }, [mergedSuggestionsKey]) 


  return (
    <div className="w-full max-w-6xl mx-auto space-y-6" ref={containerRef}>
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
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.trim().length > 2 || recentSearches.length > 0) {
                setShowSuggestions(true)
              }
            }}
            onChange={(e) => {
              if (!animating) setQuery(e.target.value)
            }}
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
                  transition={{ duration: 0.28 }}
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

        {/* Suggestions dropdown */}
        {showSuggestions && mergedSuggestions.length > 0 && (
          <div
            role="listbox"
            aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
            className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg z-50 p-4 max-h-48 overflow-y-auto"
          >
            <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Suggestions for you
              <div className="ml-auto text-xs text-muted-foreground">Press ↑/↓ and Enter to pick</div>
            </div>

            <div className="flex flex-col gap-2">
              {mergedSuggestions.map((s, idx) => (
                <div
                  key={s + idx}
                  id={`suggestion-${idx}`}
                  role="option"
                  aria-selected={activeIndex === idx}
                  className={cn(
                    "flex items-center justify-between gap-2 px-3 py-2 rounded-md cursor-pointer",
                    activeIndex === idx ? "bg-primary/10" : "hover:bg-muted/60"
                  )}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(-1)}
                  onClick={() => handleSuggestionClick(s)}
                >
                  <div className="text-sm truncate">{highlightMatch(s, query)}</div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1 rounded hover:bg-muted/40"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(s)
                      }}
                      aria-label={`Copy suggestion ${s}`}
                    >
                      <CopyIcon className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* if there are no merged suggestions but recent searches exist and query empty */}
        {showSuggestions && mergedSuggestions.length === 0 && recentSearches.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg z-50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground flex items-center gap-2"><Sparkles className="h-4 w-4" /> Recent searches</div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={clearRecent}>Clear</Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((r, i) => (
                <Badge key={r + i} variant="secondary" className="cursor-pointer" onClick={() => handleSuggestionClick(r)}>
                  {r}
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
