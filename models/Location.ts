import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description?: string;
  profile_photo_url?: string;
}

export interface ILocation {
  _id: string;
  name: string;
  address: string;
  hours?: string[];
  type?: string[];
  vibes?: string[];
  description?: string;
  image?: string;
  rating?: number;
  location?: { lat: number; lng: number };
  reviews?: IReview[];
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  author_name: { type: String, required: true },
  rating: { type: Number, required: true },
  text: { type: String, default: "" },
  relative_time_description: { type: String, required: false },
  profile_photo_url: { type: String, default: "" },
});

const LocationSchema = new Schema<ILocation>({
  _id: { type: String, required: true }, 
  name: { type: String, required: true },
  address: { type: String, required: true },
  hours: { type: [String], default: [] },
  type: { type: [String], default: [] },
  vibes: { type: [String], default: [] },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  rating: { type: Number, default: 0 },
  location: { lat: { type: Number }, lng: { type: Number } },
  reviews: { type: [ReviewSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const Location: Model<ILocation> =
  mongoose.models.Location || mongoose.model<ILocation>("Location", LocationSchema);

export default Location;
