import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  type: "menu" | "event" | "product" | "gallery";
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ["menu", "event", "product", "gallery"] },
  },
  { timestamps: true }
);

CategorySchema.index({ name: 1, type: 1 }, { unique: true });
CategorySchema.index({ slug: 1, type: 1 }, { unique: true });

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
