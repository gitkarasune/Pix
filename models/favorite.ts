import mongoose, { Schema, Document } from "mongoose"
import { IUser } from "./user"

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId
  imageId: string
  imageData: unknown
  createdAt: Date
  user?: IUser | string
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    imageId: { type: String, required: true },
    imageData: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

FavoriteSchema.index({ userId: 1, imageId: 1 }, { unique: true })

export const Favorite =
  mongoose.models.Favorite || mongoose.model<IFavorite>("Favorite", FavoriteSchema)

export default Favorite