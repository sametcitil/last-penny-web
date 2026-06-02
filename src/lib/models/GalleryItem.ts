import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGalleryItem extends Document {
  title: string;
  category: "lezzet" | "mekan";
  description: string;
  gradient: string;
  iconName: string; // e.g., 'Coffee', 'Music', 'Sparkles', 'Heart'
  quote?: string;
  quoteAuthor?: string;
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
    description: { type: String, required: true },
    gradient: { type: String, required: true },
    iconName: { type: String, required: true, default: "Camera" },
    quote: { type: String, trim: true },
    quoteAuthor: { type: String, trim: true },
  },
  { timestamps: true }
);

const GalleryItem: Model<IGalleryItem> =
  mongoose.models.GalleryItem || mongoose.model<IGalleryItem>("GalleryItem", GalleryItemSchema);

export default GalleryItem;
