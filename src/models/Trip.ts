import mongoose, { Document, Schema } from 'mongoose';

export interface TripDocument extends Document {
  origin: string;
  destination: string;
  cost: number;
  duration: number;
  type: string;
  id: string;
  display_name: string;    
}

const tripSchema = new Schema({
  origin: { type: String, required: true },
  destination: { type: String, required: true }, 
  cost: { type: Number, required: true },
  duration: { type: Number, required: true },
  type: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  display_name: { type: String, required: true }, 
});

// Compound index for "cheapest" queries
tripSchema.index({ origin: 1, destination: 1, cost: 1 });

// Compound index for "fastest" queries
tripSchema.index({ origin: 1, destination: 1, duration: 1 });

export const TripModel = mongoose.model<TripDocument>('Trip', tripSchema);
