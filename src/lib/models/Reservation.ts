import mongoose, { Schema, Document } from 'mongoose';

export interface IReservation extends Document {
  name: string;
  phone: string;
  email?: string;
  date: Date;
  time: string;       // "19:30"
  partySize: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema: Schema = new Schema(
  {
    name:      { type: String, required: true, trim: true },
    phone:     { type: String, required: true, trim: true },
    email:     { type: String, trim: true, lowercase: true },
    date:      { type: Date, required: true },
    time:      { type: String, required: true },
    partySize: { type: Number, required: true, min: 1, max: 50 },
    notes:     { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Reservation ||
  mongoose.model<IReservation>('Reservation', ReservationSchema);