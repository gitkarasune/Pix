import { Document, Schema, model, models } from "mongoose"

export interface IImageInCollection extends Document {
  collectionId: string
  imageId: string
  imageData: Record<string, unknown>
  createdAt: Date
}

const ImageInCollectionSchema = new Schema<IImageInCollection>({
  collectionId: { type: String, required: true },
  imageId: { type: String, required: true },
  imageData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
})

export const ImageInCollection =
  models.ImageInCollection || model<IImageInCollection>("ImageInCollection", ImageInCollectionSchema)


export default ImageInCollection;