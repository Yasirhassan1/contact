import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  phoneNo: string;
  email: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Contact ||
  mongoose.model<IContact>("Contact", ContactSchema);
