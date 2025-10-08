import type { ColorPalette, UnsplashImage } from "./types"

class ColorPaletteAPI {
  // Extract dominant colors from image using canvas
  async extractColors(imageUrl: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        // Resize for performance
        const maxSize = 100
        const scale = Math.min(maxSize / img.width, maxSize / img.height)
        canvas.width = img.width * scale
        canvas.height = img.height * scale

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const colors = this.quantizeColors(imageData.data, 8)

        resolve(colors)
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = imageUrl
    })
  }

  // Quantize colors using median cut algorithm
  private quantizeColors(pixels: Uint8ClampedArray, colorCount: number): string[] {
    const colorMap = new Map<string, number>()

    // Sample pixels (every 4th pixel for performance)
    for (let i = 0; i < pixels.length; i += 16) {
      const r = pixels[i]
      const g = pixels[i + 1]
      const b = pixels[i + 2]
      const a = pixels[i + 3]

      // Skip transparent pixels
      if (a < 128) continue

      const color = this.rgbToHex(r, g, b)
      colorMap.set(color, (colorMap.get(color) || 0) + 1)
    }

    // Sort by frequency and get top colors
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, colorCount)
      .map(([color]) => color)

    return sortedColors
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  // Generate complementary colors
  generateComplementary(hex: string): string[] {
    const rgb = this.hexToRgb(hex)
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b)

    // Complementary is 180 degrees opposite
    const compHue = (hsl.h + 180) % 360
    const comp = this.hslToRgb(compHue, hsl.s, hsl.l)

    return [hex, this.rgbToHex(comp.r, comp.g, comp.b)]
  }

  // Generate analogous colors
  generateAnalogous(hex: string): string[] {
    const rgb = this.hexToRgb(hex)
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b)

    const colors = []
    for (const offset of [-30, 0, 30]) {
      const hue = (hsl.h + offset + 360) % 360
      const color = this.hslToRgb(hue, hsl.s, hsl.l)
      colors.push(this.rgbToHex(color.r, color.g, color.b))
    }

    return colors
  }

  // Generate triadic colors
  generateTriadic(hex: string): string[] {
    const rgb = this.hexToRgb(hex)
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b)

    const colors = []
    for (const offset of [0, 120, 240]) {
      const hue = (hsl.h + offset) % 360
      const color = this.hslToRgb(hue, hsl.s, hsl.l)
      colors.push(this.rgbToHex(color.r, color.g, color.b))
    }

    return colors
  }

  // Calculate contrast ratio for accessibility
  calculateContrast(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1)
    const rgb2 = this.hexToRgb(color2)

    const l1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b)
    const l2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b)

    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)

    return (lighter + 0.05) / (darker + 0.05)
  }

  private getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return { h: h * 360, s, l }
  }

  private hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  // Generate full color palette
  async generatePalette(image: UnsplashImage): Promise<ColorPalette> {
    const dominantColors = await this.extractColors(image.urls.small)
    const primaryColor = dominantColors[0]

    const complementaryColors = this.generateComplementary(primaryColor)
    const analogousColors = this.generateAnalogous(primaryColor)
    const triadicColors = this.generateTriadic(primaryColor)

    // Check accessibility
    const contrastRatio = this.calculateContrast(primaryColor, "#ffffff")
    const wcagAA = contrastRatio >= 4.5
    const wcagAAA = contrastRatio >= 7

    // Generate CSS variables
    const cssVariables = this.generateCSSVariables(dominantColors)

    // Generate Tailwind config
    const tailwindConfig = this.generateTailwindConfig(dominantColors)

    return {
      id: Date.now().toString(),
      imageId: image.id,
      dominantColors,
      complementaryColors,
      analogousColors,
      triadicColors,
      accessibility: {
        wcagAA,
        wcagAAA,
        contrastRatio,
      },
      cssVariables,
      tailwindConfig,
      createdAt: new Date(),
    }
  }

  private generateCSSVariables(colors: string[]): string {
    return `:root {\n${colors.map((color, i) => `  --color-${i + 1}: ${color};`).join("\n")}\n}`
  }

  private generateTailwindConfig(colors: string[]): string {
    const colorObj = colors.reduce(
      (acc, color, i) => {
        acc[`brand-${i + 1}`] = color
        return acc
      },
      {} as Record<string, string>,
    )

    return `module.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(colorObj, null, 8)}\n    }\n  }\n}`
  }
}

export const colorPaletteAPI = new ColorPaletteAPI()
