import { DEEPSEEK_API_KEY, API_ENDPOINTS } from "./constants"
import type { AIImageAnalysis, UnsplashImage } from "./types"

const OPENROUTER_SITE_URL = process.env.OPENROUTER_SITE_URL
const OPENROUTER_SITE_NAME = process.env.OPENROUTER_SITE_NAME

class DeepSeekAPI {
  private baseHeaders = {
    Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    "Content-Type": "application/json",
    ...(OPENROUTER_SITE_URL ? { "HTTP-Referer": OPENROUTER_SITE_URL } : {}),
    ...(OPENROUTER_SITE_NAME ? { "X-Title": OPENROUTER_SITE_NAME } : {}),
  }

  async analyzeImage(image: UnsplashImage): Promise<AIImageAnalysis> {
    const prompt = `Analyze this image and provide insights:
    
    Image Details:
    - Description: ${image.description || image.alt_description || "No description"}
    - Photographer: ${image.user.name}
    - Colors: ${image.color}
    - Dimensions: ${image.width}x${image.height}
    
    Please provide:
    1. A detailed description of what you see
    2. Relevant tags (5-10 keywords)
    3. The mood/atmosphere of the image
    4. Dominant colors
    5. Suggestions for similar images or use cases
    
    Respond in JSON format with keys: description, tags, mood, colors, suggestions`

    try {
      const response = await fetch(API_ENDPOINTS.DEEPSEEK_CHAT, {
        method: "POST",
        headers: this.baseHeaders,
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3.1:free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      try {
        return JSON.parse(content)
      } catch {
        // Fallback if JSON parsing fails
        return {
          description: image.description || image.alt_description || "Beautiful image",
          tags: image.tags?.map((tag) => tag.title) || ["photography", "art"],
          mood: "inspiring",
          colors: [image.color],
          suggestions: ["Similar photography", "Related artwork"],
        }
      }
    } catch (error) {
      console.error("OpenRouter DeepSeek API error:", error)
      // Return fallback analysis
      return {
        description: image.description || image.alt_description || "Beautiful image",
        tags: image.tags?.map((tag) => tag.title) || ["photography", "art"],
        mood: "inspiring",
        colors: [image.color],
        suggestions: ["Similar photography", "Related artwork"],
      }
    }
  }

  async generateSearchSuggestions(query: string): Promise<string[]> {
    const prompt = `Given the search query "${query}", suggest 8 related search terms that would help find similar or complementary images. Return only the search terms as a JSON array of strings.`

    try {
      const response = await fetch(API_ENDPOINTS.DEEPSEEK_CHAT, {
        method: "POST",
        headers: this.baseHeaders,
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3.1:free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.8,
          max_tokens: 200,
        }),
      })

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      try {
        return JSON.parse(content)
      } catch {
        return [query, `${query} photography`, `${query} art`, `${query} design`]
      }
    } catch (error) {
      console.error("DeepSeek API error:", error)
      return [query, `${query} photography`, `${query} art`, `${query} design`]
    }
  }
}

export const deepSeekAPI = new DeepSeekAPI()
