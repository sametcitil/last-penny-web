import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  time: string;
  image: string;
  category: "jazz" | "rock" | "acoustic" | "dj" | "talk" | "other";
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
    category: {
      type: String,
      enum: ["jazz", "rock", "acoustic", "dj", "talk", "other"],
      required: true,
    },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
