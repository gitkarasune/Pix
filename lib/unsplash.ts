import type { UnsplashImage, UnsplashSearchResponse } from "./types"
import { NEXT_PUBLIC_UNSPLASH_ACCESS_KEY, API_ENDPOINTS, DEFAULT_SEARCH_PARAMS } from "./constants"

class UnsplashAPI {
  private baseHeaders = {
    Authorization: `Client-ID ${NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
    "Content-Type": "application/json",
  }

  async searchPhotos(
    query: string,
    page = 1,
    perPage = DEFAULT_SEARCH_PARAMS.per_page,
  ): Promise<UnsplashSearchResponse> {
    const url = new URL(API_ENDPOINTS.UNSPLASH_SEARCH)
    url.searchParams.set("query", query)
    url.searchParams.set("page", page.toString())
    url.searchParams.set("per_page", perPage.toString())
    url.searchParams.set("order_by", DEFAULT_SEARCH_PARAMS.order_by)

    const response = await fetch(url.toString(), {
      headers: this.baseHeaders,
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    return response.json()
  }

  async getRandomPhotos(count = 30, query?: string): Promise<UnsplashImage[]> {
    const url = new URL(API_ENDPOINTS.UNSPLASH_RANDOM)
    url.searchParams.set("count", count.toString())
    if (query) {
      url.searchParams.set("query", query)
    }

    const response = await fetch(url.toString(), {
      headers: this.baseHeaders,
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    return response.json()
  }

  async getPhotoById(id: string): Promise<UnsplashImage> {
    const response = await fetch(`${API_ENDPOINTS.UNSPLASH_PHOTO}/${id}`, {
      headers: this.baseHeaders,
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    return response.json()
  }

  async downloadPhoto(downloadUrl: string): Promise<void> {
    // Trigger download tracking
    await fetch(downloadUrl, {
      headers: this.baseHeaders,
    })
  }
}

export const unsplashAPI = new UnsplashAPI()
