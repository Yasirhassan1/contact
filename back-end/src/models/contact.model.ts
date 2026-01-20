import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
  name: string;
  phoneNo: string;
  email: string;
  owner: mongoose.Types.ObjectId,
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
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:"User",
    }

  },
  {
    timestamps: true,
  },
);

const Contact: Model<IContact> = mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
export default Contact;