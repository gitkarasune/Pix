import mongoose, { Schema, Document } from "mongoose"
import { IUser } from "./user"

export interface ICollection extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  description?: string
  createdAt: Date
  user?: IUser
}

const CollectionSchema = new Schema<ICollection>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export const Collection =
  mongoose.models.Collection || mongoose.model<ICollection>("Collection", CollectionSchema)

  export default Collection