"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Folder, Trash2, Edit } from "lucide-react"
import { toast } from "sonner"
import type { UnsplashImage } from "@/lib/types"
import Image from "next/image"

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
  createdAt: string // stored in localStorage as string
}

interface CollectionsProps {
  images?: UnsplashImage[] // Pass all images available
  onAddToCollection?: (imageId: string, collectionId: string) => void
}

export default function Collections({ images = [], onAddToCollection }: CollectionsProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newCollectionDescription, setNewCollectionDescription] = useState("")
  const [addImageModal, setAddImageModal] = useState<{ open: boolean; collectionId: string | null }>({ open: false, collectionId: null})

  useEffect(() => {
    loadCollections()
  }, [])

  // Helper functions to get Image by ID
  const getImageById = (id: string) => images.find((img) => img.id === id)

  const loadCollections = () => {
    const savedCollections = localStorage.getItem("pixelvault-collections")
    if (savedCollections) {
      const parsed: StoredCollection[] = JSON.parse(savedCollections)
      const mapped: Collection[] = parsed.map((c) => ({
        ...c,
        createdAt: new Date(c.createdAt),
      }))
      setCollections(mapped)
    }
  }

  const saveCollections = (newCollections: Collection[]) => {
    localStorage.setItem("pixelvault-collections", JSON.stringify(newCollections))
    setCollections(newCollections)
  }

  const createCollection = () => {
    if (!newCollectionName.trim()) return

    const newCollection: Collection = {
      id: Date.now().toString(),
      name: newCollectionName.trim(),
      description: newCollectionDescription.trim(),
      images: [],
      createdAt: new Date(),
    }

    const updatedCollections = [...collections, newCollection]
    saveCollections(updatedCollections)

    setNewCollectionName("")
    setNewCollectionDescription("")
    setIsCreateModalOpen(false)

    toast.success(`"${newCollection.name}" has been created.`)
  }

  const deleteCollection = (collectionId: string) => {
    const updatedCollections = collections.filter((c) => c.id !== collectionId)
    saveCollections(updatedCollections)

    toast.success("Collection has been removed.")
  }

  const addImageToCollection = (imageId: string, collectionId: string) => {
    const updatedCollections = collections.map((collection) => {
      if (collection.id === collectionId && !collection.images.includes(imageId)) {
        return { ...collection, images: [...collection.images, imageId] }
      }
      return collection
    })

    saveCollections(updatedCollections)
    onAddToCollection?.(imageId, collectionId)

    toast.success("Image has been added to your collection.")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Folder className="h-6 w-6" />
          My Collections
        </h2>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
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
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createCollection} disabled={!newCollectionName.trim()}>
                  Create Collection
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Image Modal */}
      <Dialog open={addImageModal.open} onOpenChange={(open) => setAddImageModal({ open, collectionId: addImageModal.collectionId })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Image to Add</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {images.map((img) => (
              <div key={img.id} className="cursor-pointer" onClick={() => {
                if (addImageModal.collectionId) {
                  addImageToCollection(img.id, addImageModal.collectionId)
                  setAddImageModal({ open: false, collectionId: null })
                }
              }}>
                <Image
                 src={img.urls.thumb}
                  alt={img.alt_description || "Image"}
                   className="rounded w-full"
                   width={100}
                   height={100}
                   quality={100}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      </div>

      {collections.length === 0 ? (
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
          {collections.map((collection) => (
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
                          {/* Placeholder for collection preview images */}
                          {
                            img ? (
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
                            )
                          }
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
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      View Collection
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      // onClick={() => addImageToCollection("demo-image-id", collection.id)}
                      onClick={() => setAddImageModal({ open: true, collectionId: collection.id })}
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Image
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
