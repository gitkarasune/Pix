export const NEXT_PUBLIC_UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
export const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY

export const API_ENDPOINTS = {
  UNSPLASH_SEARCH: "https://api.unsplash.com/search/photos",
  UNSPLASH_RANDOM: "https://api.unsplash.com/photos/random",
  UNSPLASH_PHOTO: "https://api.unsplash.com/photos",
  DEEPSEEK_CHAT: "https://openrouter.ai/api/v1/chat/completions",
} as const

export const DEFAULT_SEARCH_PARAMS = {
  per_page: 30,
  order_by: "relevant" as const,
}

export const IMAGE_CATEGORIES = [
  "nature",
  "architecture",
  "technology",
  "people",
  "animals",
  "food",
  "travel",
  "business",
  "fashion",
  "art",
  "Laptops"
] as const
