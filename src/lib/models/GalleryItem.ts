import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGalleryItem extends Document {
  title: string;
  category: "lezzet" | "mekan";
  image: string; // Base64 data URL or relative path
  createdAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["lezzet", "mekan"],
      required: true,
    },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const GalleryItem: Model<IGalleryItem> =
  mongoose.models.GalleryItem || mongoose.model<IGalleryItem>("GalleryItem", GalleryItemSchema);

export default GalleryItem;
