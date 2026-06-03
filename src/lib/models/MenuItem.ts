import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMenuItem extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
    },
    image: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MenuItem: Model<IMenuItem> =
  mongoose.models.MenuItem || mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);

export default MenuItem;
