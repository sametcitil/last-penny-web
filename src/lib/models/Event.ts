import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  time: string;
  image: string;
  images?: string[];
  price?: number;
  location?: string;
  category: string;
  isFeatured: boolean;
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    image: { type: String, default: "" },
    images: [{ type: String }],
    price: { type: Number, default: 0 },
    location: { type: String, default: "LP Kavaklıdere Sahne" },
    category: {
      type: String,
      required: true,
    },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
