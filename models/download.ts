import mongoose, { Schema, Document } from "mongoose"
import { IUser } from "./user"

export interface IDownload extends Document {
  userId: mongoose.Types.ObjectId
  imageId: string
  createdAt: Date
  user?: IUser
}

const DownloadSchema = new Schema<IDownload>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    imageId: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export const Download =
  mongoose.models.Download || mongoose.model<IDownload>("Download", DownloadSchema)

  export default Download