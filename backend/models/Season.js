import mongoose from "mongoose";
const { Schema } = mongoose;

const SeasonSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true }, // e.g. "winter_2025"
    title: { type: String, required: true, trim: true }, // "Winter Rewards"
    isActive: { type: Boolean, default: false }, // YOU toggle
    startsAt: { type: Date },
    endsAt: { type: Date },

    // Optional: global multiplier for the season (simple 2K-style)
    xpMultiplier: { type: Number, default: 1, min: 0.1, max: 5 },

    // Optional: allowlist of reason codes that get multipliers
    boostedReasons: [{ type: String, trim: true }], // e.g. ["BOOKING_CONFIRMED", "SAVED_TRIP"]
  },
  { timestamps: true }
);

const Season = mongoose.models.Season || mongoose.model("Season", SeasonSchema);
export default Season;