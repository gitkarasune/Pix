import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  email: string
  firstName?: string
  lastName?: string
  imageUrl?: string
  clerkUserId: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    imageUrl: String,
    clerkUserId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
)

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)


  export default User