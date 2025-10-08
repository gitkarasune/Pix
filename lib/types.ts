export interface UnsplashImage {
  id: string
  created_at: string
  updated_at: string
  width: number
  height: number
  color: string
  blur_hash: string
  description: string | null
  alt_description: string | null
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  links: {
    self: string
    html: string
    download: string
    download_location: string
  }
  likes: number
  user: {
    id: string
    username: string
    name: string
    first_name: string
    last_name: string | null
    twitter_username: string | null
    portfolio_url: string | null
    bio: string | null
    location: string | null
    links: {
      self: string
      html: string
      photos: string
      likes: string
      portfolio: string
      following: string
      followers: string
    }
    profile_image: {
      small: string
      medium: string
      large: string
    }
    instagram_username: string | null
    total_collections: number
    total_likes: number
    total_photos: number
  }
  tags?: Array<{
    type: string
    title: string
  }>
}

export interface UnsplashSearchResponse {
  total: number
  total_pages: number
  results: UnsplashImage[]
}

export interface UserGallery {
  id: string
  userId: string
  imageId: string
  imageData: UnsplashImage
  createdAt: Date
  tags?: string[]
}

export interface AIImageAnalysis {
  description: string
  tags: string[]
  mood: string
  colors: string[]
  suggestions: string[]
}
export interface ColorPalette {
  id: string
  imageId: string
  dominantColors: string[]
  complementaryColors: string[]
  analogousColors: string[]
  triadicColors: string[]
  accessibility: {
    wcagAA: boolean
    wcagAAA: boolean
    contrastRatio: number
  }
  cssVariables: string
  tailwindConfig: string
  createdAt: Date
}

export interface ImageCollection {
  id: string
  userId: string
  name: string
  description?: string
  images: UnsplashImage[]
  tags: string[]
  mood: string
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  shareUrl?: string
}

export interface MoodBoard {
  id: string
  collectionId: string
  layout: "grid" | "masonry" | "collage" | "magazine"
  title: string
  subtitle?: string
  images: UnsplashImage[]
  createdAt: Date
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  images?: UnsplashImage[]
  timestamp: Date
}

export interface ImageChatSession {
  imageId: string
  messages: ChatMessage[]
}
