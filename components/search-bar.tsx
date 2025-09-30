"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, X, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IMAGE_CATEGORIES } from "@/lib/constants"

interface SearchBarProps {
  onSearch: (query: string) => void
  onCategorySelect: (category: string) => void
  loading?: boolean
  suggestions?: string[]
}

export default function SearchBar({ onSearch, onCategorySelect, loading = false, suggestions = [] }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setShowSuggestions(false)
    }
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
          <Input
            type="text"
            placeholder="Search for amazing images... (e.g., 'sunset mountains', 'modern architecture')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-24 h-16 text-lg bg-background/60 backdrop-blur-sm border-1 focus:border-primary/50 transition-colors relative"
            disabled={loading}
          />
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
              className={`bg-black text-white dark:bg-white dark:text-black py-7 ${loading ? "px-7" : ""} accent-sidebar-border`}
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 dark:border-black border-white border-t-transparent" />
              ) : (
                // <Sparkles className="h-4 w-4" />
                <span>Search</span>
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