import mongoose from "mongoose";

const CarSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    model: { type: String, required: true },
    location: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    rating: { type: Number, min: 0, max: 5 },
    seats: { type: Number },
    transmission: {
      type: String,
      enum: ["automatic", "manual"],
      default: "automatic",
    },
    fuelType: {
      type: String,
      enum: ["gasoline", "diesel", "electric", "hybrid"],
    },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Add useful index for searches
CarSchema.index({ location: 1, pickupDate: 1 });

// Export safely
export default mongoose.models.Car || mongoose.model("Car", CarSchema);
