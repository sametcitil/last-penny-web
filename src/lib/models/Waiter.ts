import mongoose, { Schema, Document } from 'mongoose';

export interface IWaiter extends Document {
  name: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  schedule: {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    shift: 'morning' | 'evening' | 'night';
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const WaiterSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    isActive: { type: Boolean, default: true },
    schedule: [
      {
        day: {
          type: String,
          enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          required: true,
        },
        shift: {
          type: String,
          enum: ['morning', 'evening', 'night'],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Waiter ||
  mongoose.model<IWaiter>('Waiter', WaiterSchema);