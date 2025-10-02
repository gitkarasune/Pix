
"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Folder, Trash2, Edit, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import type { UnsplashImage } from "@/lib/types"
import Image from "next/image"
import { unsplashAPI } from "@/lib/unsplash"
import { useUserStorage } from "@/lib/use-user-storage"

interface Collection {
  id: string
  name: string
  description: string
  images: string[] // image IDs
  createdAt: Date
}
interface StoredCollection {
  id: string
  name: string
  description: string
  images: string[]
  createdAt: string // ISO string
}

interface CollectionsProps {
  images?: UnsplashImage[] // Pass all images available (for quick local lookups)
  onAddToCollection?: (imageId: string, collectionId: string) => void
}

export default function Collections({ images = [], onAddToCollection }: CollectionsProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newCollectionDescription, setNewCollectionDescription] = useState("")
  const [viewCollection, setViewCollection] = useState<Collection | null>(null)
  const { getItem, setItem } = useUserStorage()

  // For create dialog search & selection
  const [createSearchQuery, setCreateSearchQuery] = useState("")
  const [createSearchResults, setCreateSearchResults] = useState<UnsplashImage[]>([])
  const [createSearchLoading, setCreateSearchLoading] = useState(false)
  const [createSelectedImages, setCreateSelectedImages] = useState<string[]>([])

  // For view dialog search (adding images to existing collection)
  const [viewSearchQuery, setViewSearchQuery] = useState("")
  const [viewSearchResults, setViewSearchResults] = useState<UnsplashImage[]>([])
  const [viewSearchLoading, setViewSearchLoading] = useState(false)
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false)

  useEffect(() => {
    loadCollections()
  }, [])

  // Helper to find image by id from prop images or from unsplash (fallback)
  const getImageById = (id: string): UnsplashImage | undefined => {
    const local = images.find((img) => img.id === id)
    if (local) return local

    //fallback fetch
    return undefined
  }

  // Persist collections to localStorage
  const saveCollections = (newCollections: Collection[]) => {
    const stored: StoredCollection[] = newCollections.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      images: c.images,
      createdAt: c.createdAt.toISOString(),
    }))
    setItem("collections", stored)
    setCollections(newCollections)
  }

  // Load collections from localStorage (keeps forever unless user clears)
  const loadCollections = () => {
    try {
      const savedCollections = getItem("collections")
      if (!savedCollections) {
        setCollections([])
        return
      }
      const parsed: StoredCollection[] = JSON.parse(savedCollections)
      const mapped: Collection[] = parsed.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        images: c.images,
        createdAt: new Date(c.createdAt),
      }))
      setCollections(mapped)
    } catch (err) {
      console.error("Failed to load collections", err)
      setCollections([])
    }
  }

  // Create a new collection (allow adding selected images at creation)
  const createCollection = () => {
    if (!newCollectionName.trim()) return toast.error("Please provide a name.")
    const newCollection: Collection = {
      id: Date.now().toString(),
      name: newCollectionName.trim(),
      description: newCollectionDescription.trim(),
      images: createSelectedImages.slice(), // selected while creating
      createdAt: new Date(),
    }
    const updatedCollections = [...collections, newCollection]
    saveCollections(updatedCollections)

    // reset create dialog state
    setNewCollectionName("")
    setNewCollectionDescription("")
    setCreateSearchQuery("")
    setCreateSearchResults([])
    setCreateSelectedImages([])
    setIsCreateModalOpen(false)

    toast.success(`"${newCollection.name}" has been created.`)
  }

  const deleteCollection = (collectionId: string) => {
    const updatedCollections = collections.filter((c) => c.id !== collectionId)
    saveCollections(updatedCollections)
    // If the currently open viewCollection was deleted, close it
    if (viewCollection?.id === collectionId) {
      setViewCollection(null)
    }
    toast.success("Collection has been removed.")
  }

  // add image to an existing collection (by id)
  const addImageToCollection = (imageId: string, collectionId: string) => {
    const updatedCollections = collections.map((collection) => {
      if (collection.id === collectionId) {
        if (collection.images.includes(imageId)) {
          // already present
          return collection
        }
        return { ...collection, images: [...collection.images, imageId] }
      }
      return collection
    })
    saveCollections(updatedCollections)
    onAddToCollection?.(imageId, collectionId)
    // If viewCollection currently open, update highlighted view
    if (viewCollection?.id === collectionId) {
      setViewCollection(updatedCollections.find((c) => c.id === collectionId) || null)
    }
    toast.success("Image has been added to your collection.")
  }

  // remove image from a collection
  const removeImageFromCollection = (collectionId: string, imageId: string) => {
    const updatedCollections = collections.map((collection) => {
      if (collection.id === collectionId) {
        return { ...collection, images: collection.images.filter((i) => i !== imageId) }
      }
      return collection
    })
    saveCollections(updatedCollections)
    if (viewCollection?.id === collectionId) {
      setViewCollection(updatedCollections.find((c) => c.id === collectionId) || null)
    }
    toast.success("Image removed from collection.")
  }

  // Search helpers: use unsplashAPI.searchPhotos
  // Debounce-ish simple: useEffect run when query changes after 300ms
  useEffect(() => {
    const controller = new AbortController()
    if (!createSearchQuery || createSearchQuery.trim().length < 2) {
      setCreateSearchResults([])
      setCreateSearchLoading(false)
      return
    }
    setCreateSearchLoading(true)
    const id = setTimeout(async () => {
      try {
        const res = await unsplashAPI.searchPhotos(createSearchQuery.trim(), 1, 18)
        setCreateSearchResults(res.results ?? [])
      } catch (err) {
        console.error("Create search failed", err)
        setCreateSearchResults([])
      } finally {
        setCreateSearchLoading(false)
      }
    }, 300)

    return () => {
      clearTimeout(id)
      controller.abort()
    }
  }, [createSearchQuery])

  useEffect(() => {
    const controller = new AbortController()
    if (!viewSearchQuery || viewSearchQuery.trim().length < 2) {
      setViewSearchResults([])
      setViewSearchLoading(false)
      return
    }
    setViewSearchLoading(true)
    const id = setTimeout(async () => {
      try {
        const res = await unsplashAPI.searchPhotos(viewSearchQuery.trim(), 1, 18)
        setViewSearchResults(res.results ?? [])
      } catch (err) {
        console.error("View search failed", err)
        setViewSearchResults([])
      } finally {
        setViewSearchLoading(false)
      }
    }, 300)

    return () => {
      clearTimeout(id)
      controller.abort()
    }
  }, [viewSearchQuery])

  const createToggleSelect = (imageId: string) => {
    setCreateSelectedImages((prev) => (prev.includes(imageId) ? prev.filter((i) => i !== imageId) : [...prev, imageId]))
  }

  // quick memo of collections to render
  const collectionsMemo = useMemo(() => collections, [collections])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Folder className="h-6 w-6" />
          My Collections
        </h2>

        {/* Create Collection Dialog (wide on large screens) */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Collection
            </Button>
          </DialogTrigger>

          <DialogContent className="w-full max-w-xl lg:max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
            </DialogHeader>

            {/* Search at top of the dialog */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Search images to add</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search Unsplash images (e.g., 'mountains', 'portrait')"
                    value={createSearchQuery}
                    onChange={(e) => setCreateSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCreateSearchQuery("")
                      setCreateSearchResults([])
                    }}
                  >
                    Clear
                  </Button>
                </div>

                {/* Search results */}
                {createSearchLoading ? (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-24 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : createSearchResults.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {createSearchResults.map((img) => (
                      <div
                        key={img.id}
                        className={`relative h-24 rounded overflow-hidden cursor-pointer border ${createSelectedImages.includes(img.id) ? "ring-2 ring-primary" : "border-transparent"}`}
                        onClick={() => createToggleSelect(img.id)}
                      >
                        <Image src={img.urls.thumb} alt={img.alt_description || "Image"} fill style={{ objectFit: "cover" }} />
                        {createSelectedImages.includes(img.id) && (
                          <div className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">Selected</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  createSearchQuery.trim().length >= 2 && (
                    <div className="text-sm text-muted-foreground mt-3">No results</div>
                  )
                )}
              </div>

              {/* Name, description */}
              <div>
                <label className="text-sm font-medium">Collection Name</label>
                <Input
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Enter collection name..."
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description (Optional)</label>
                <Input
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                  placeholder="Describe your collection..."
                  className="mt-1"
                />
              </div>

              {/* Selected preview */}
              {createSelectedImages.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Selected images ({createSelectedImages.length})</div>
                  <div className="grid grid-cols-6 gap-2">
                    {createSelectedImages.map((id) => {
                      const img = getImageById(id)
                      return img ? (
                        <div key={id} className="h-20 w-full rounded overflow-hidden relative">
                          <Image src={img.urls.thumb} alt={img.alt_description || "Image"} fill style={{ objectFit: "cover" }} />
                        </div>
                      ) : (
                        <div key={id} className="h-20 bg-muted rounded" />
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                <Button onClick={createCollection} disabled={!newCollectionName.trim()}>Create Collection</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Image Modal (used from View Collection 'Add More') */}
        <Dialog open={isAddImageModalOpen} onOpenChange={setIsAddImageModalOpen}>
          <DialogContent className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add images to collection</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Search Unsplash</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search to add images..."
                    value={viewSearchQuery}
                    onChange={(e) => setViewSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="ghost" onClick={() => { setViewSearchQuery(""); setViewSearchResults([]) }}>Clear</Button>
                </div>

                {viewSearchLoading ? (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-24 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : viewSearchResults.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {viewSearchResults.map((img) => (
                      <div key={img.id} className="relative h-24 rounded overflow-hidden cursor-pointer" onClick={() => {
                        if (!viewCollection) return
                        addImageToCollection(img.id, viewCollection.id)
                      }}>
                        <Image src={img.urls.thumb} alt={img.alt_description || "Image"} fill style={{ objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  viewSearchQuery.trim().length >= 2 && <div className="text-sm text-muted-foreground mt-3">No results</div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddImageModalOpen(false)}>Close</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Collection Dialog (wide on large screens) */}
        <Dialog open={!!viewCollection} onOpenChange={() => setViewCollection(null)}>
          <DialogContent className="w-full max-w-3xl lg:max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{viewCollection?.name}</DialogTitle>
            </DialogHeader>

            {viewCollection ? (
              <div className="space-y-4">
                {/* header details */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{viewCollection.name}</div>
                    {viewCollection.description && <div className="text-sm text-muted-foreground">{viewCollection.description}</div>}
                    <div className="text-xs text-muted-foreground mt-1">Created: {viewCollection.createdAt.toLocaleDateString()}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsAddImageModalOpen(true)}>Add More</Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      // copy collection link / JSON to clipboard
                      navigator.clipboard.writeText(JSON.stringify(viewCollection))
                      toast.success("Collection JSON copied")
                    }}>Export</Button>
                  </div>
                </div>

                {/* images grid */}
                {viewCollection.images.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">No images in this collection yet.</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {viewCollection.images.map((id) => {
                      const img = getImageById(id)
                      return (
                        <div key={id} className="relative rounded overflow-hidden group">
                          {img ? (
                            <>
                              <Image src={img.urls.small} alt={img.alt_description || "Image"} width={300} height={200} quality={100}
                              className="object-cover w-full h-40" />
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="ghost" onClick={() => removeImageFromCollection(viewCollection.id, id)}>Remove</Button>
                              </div>
                            </>
                          ) : (
                            <div className="h-40 w-full bg-muted" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setViewCollection(null)}>Close</Button>
                  <Button onClick={() => setIsAddImageModalOpen(true)}>Add More</Button>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>

      {/* Collections list */}
      {collectionsMemo.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Collections Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create collections to organize your favorite images by theme, project, or mood.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Collection
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collectionsMemo.map((collection) => (
            <Card key={collection.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{collection.name}</CardTitle>
                    {collection.description && (
                      <p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCollection(collection.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="secondary">{collection.images.length} images</Badge>
                    <span className="text-muted-foreground">{collection.createdAt.toLocaleDateString()}</span>
                  </div>

                  {collection.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-1">
                      {collection.images.slice(0, 3).map((imageId, index) => {
                        const img = getImageById(imageId)
                        return (
                          <div key={index} className="aspect-square bg-muted rounded overflow-hidden">
                            {img ? (
                              <Image
                                src={img.urls.thumb}
                                alt={img.alt_description || "Image"}
                                className="object-cover w-full h-full"
                                width={100}
                                height={100}
                                quality={100}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setViewCollection(collection)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      View Collection
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setIsAddImageModalOpen(true)
                        setViewCollection(collection)
                      }}
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>

                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => setViewCollection(collection)}
                    >
                    {collection.images.length > 3 && (
                        <div className="flex items-center justify-center cursor-pointer" >
                          <ChevronRight className="h-6 w-6" />
                        </div>
                      )}
                    </Button>

                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
