import mongoose from "mongoose";

const CarSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    model: { type: String, required: true },
    location: { type: String, required: true },
    pickupDate: { type: String, required: true },
    returnDate: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    rating: { type: Number },
    seats: { type: Number },
  },
  { timestamps: true }
);

// ESM-friendly default export with hot-reload safety
export default mongoose.models.Car || mongoose.model("Car", CarSchema);
