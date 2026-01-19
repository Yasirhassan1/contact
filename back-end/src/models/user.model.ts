import mongoose, { Schema } from "mongoose";
export type User = {
  email: string;
  password: string;
};

const UserSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Prevents two people from using the same email
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.User || mongoose.model<User>("User", UserSchema);
