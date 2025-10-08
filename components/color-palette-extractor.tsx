"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Copy, Download, Check, Loader2 } from "lucide-react"
import type { UnsplashImage, ColorPalette } from "@/lib/types"
import { colorPaletteAPI } from "@/lib/color-palette"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"

interface ColorPaletteExtractorProps {
  image: UnsplashImage | null
  isOpen: boolean
  onClose: () => void
}

export default function ColorPaletteExtractor({ image, isOpen, onClose }: ColorPaletteExtractorProps) {
  const [palette, setPalette] = useState<ColorPalette | null>(null)
  const [loading, setLoading] = useState(false)
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  useEffect(() => {
    if (image) setPalette(null)
  }, [image])

  const handleExtractColors = async () => {
    if (!image) return

    try {
      setLoading(true)
      const extractedPalette = await colorPaletteAPI.generatePalette(image)
      setPalette(extractedPalette)
      toast.success("Color palette extracted successfully!")
    } catch (error) {
      console.error("Error extracting colors:", error)
      toast.error("Failed to extract colors. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(label)
    toast.success(`${label} copied to clipboard!`)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const handleDownloadPalette = () => {
    if (!palette) return

    const data = JSON.stringify(palette, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `color-palette-${palette.imageId}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Palette downloaded!")
  }

  if (!image) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl max-h-[91vh] overflow-y-auto lg:max-w-[70rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            AI Color Palette Extractor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!palette && (
            <div className="text-center py-8">
              <Palette className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Extract Color Palette</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Generate a complete design system from this image with dominant colors, harmonies, and accessibility
                checks.
              </p>
              <Button onClick={handleExtractColors} disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Extracting Colors...
                  </>
                ) : (
                  <>
                    <Palette className="h-4 w-4 mr-2" />
                    Extract Color Palette
                  </>
                )}
              </Button>
            </div>
          )}

          {palette && (
            <Tabs defaultValue="dominant" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="dominant">Dominant</TabsTrigger>
                <TabsTrigger value="harmonies">Harmonies</TabsTrigger>
                <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
              </TabsList>

              <TabsContent value="dominant" className="space-y-4">
                <Card>
                  <CardContent className="p-6 transition-all duration-500 ease-in-out animate-fadeIn">
                    <h3 className="font-semibold mb-4">Dominant Colors</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {palette.dominantColors.map((color, index) => (
                        <div key={index} className="space-y-2">
                          <div
                            className="w-full h-24 rounded-lg border-2 border-border cursor-pointer hover:scale-105 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => handleCopy(color, `Color ${index + 1}`)}
                          />
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs font-mono">
                              {color}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => handleCopy(color, `Color ${index + 1}`)}
                            >
                              {copiedItem === `Color ${index + 1}` ? (
                                <Check className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="harmonies" className="space-y-4">
                <Card>
                  <CardContent className="p-6 transition-all duration-500 ease-in-out animate-fadeIn space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Complementary Colors</h3>
                      <div className="flex gap-3">
                        {palette.complementaryColors.map((color, index) => (
                          <div key={index} className="flex-1 space-y-2">
                            <div
                              className="w-full h-20 rounded-lg border cursor-pointer hover:scale-105 transition-transform"
                              style={{ backgroundColor: color }}
                              onClick={() => handleCopy(color, "Complementary")}
                            />
                            <Badge variant="outline" className="text-xs font-mono w-full justify-center">
                              {color}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Analogous Colors</h3>
                      <div className="flex gap-3">
                        {palette.analogousColors.map((color, index) => (
                          <div key={index} className="flex-1 space-y-2">
                            <div
                              className="w-full h-20 rounded-lg border cursor-pointer hover:scale-105 transition-transform"
                              style={{ backgroundColor: color }}
                              onClick={() => handleCopy(color, "Analogous")}
                            />
                            <Badge variant="outline" className="text-xs font-mono w-full justify-center">
                              {color}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Triadic Colors</h3>
                      <div className="flex gap-3">
                        {palette.triadicColors.map((color, index) => (
                          <div key={index} className="flex-1 space-y-2">
                            <div
                              className="w-full h-20 rounded-lg border cursor-pointer hover:scale-105 transition-transform"
                              style={{ backgroundColor: color }}
                              onClick={() => handleCopy(color, "Triadic")}
                            />
                            <Badge variant="outline" className="text-xs font-mono w-full justify-center">
                              {color}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="accessibility" className="space-y-4">
                <Card>
                  <CardContent className="p-6 transition-all duration-500 ease-in-out animate-fadeIn space-y-4">
                    <h3 className="font-semibold mb-4">Accessibility Check</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">WCAG AA Compliance</span>
                        <Badge variant={palette.accessibility.wcagAA ? "default" : "destructive"}>
                          {palette.accessibility.wcagAA ? "Pass" : "Fail"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">WCAG AAA Compliance</span>
                        <Badge variant={palette.accessibility.wcagAAA ? "default" : "destructive"}>
                          {palette.accessibility.wcagAAA ? "Pass" : "Fail"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">Contrast Ratio</span>
                        <Badge variant="outline">{palette.accessibility.contrastRatio.toFixed(2)}:1</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      WCAG AA requires a contrast ratio of at least 4.5:1 for normal text. AAA requires 7:1.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="css" className="space-y-4">
                <Card>
                  <CardContent className="p-6 transition-all duration-500 ease-in-out animate-fadeIn">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">CSS Variables</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(palette.cssVariables, "CSS Variables")}
                      >
                        {copiedItem === "CSS Variables" ? (
                          <>
                            <Check className="h-3 w-3 mr-2 text-green-500" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{palette.cssVariables}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tailwind" className="space-y-4">
                <Card>
                  <CardContent className="p-6 transition-all duration-500 ease-in-out animate-fadeIn">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Tailwind Config</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(palette.tailwindConfig, "Tailwind Config")}
                      >
                        {copiedItem === "Tailwind Config" ? (
                          <>
                            <Check className="h-3 w-3 mr-2 text-green-500" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{palette.tailwindConfig}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {palette && (
            <div className="flex gap-2">
              <Button onClick={handleDownloadPalette} variant="outline" className="flex-1 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download Palette
              </Button>
              <Button onClick={handleExtractColors} variant="outline" className="flex-1 bg-transparent">
                <Palette className="h-4 w-4 mr-2" />
                Re-extract
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
