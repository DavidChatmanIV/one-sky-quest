import { Router } from "express";
import { Place } from "../models/index.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// 📖 GET: all places
router.get("/", async (_req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    console.error("❌ Failed to fetch places:", err);
    res.status(500).json({ message: "Error fetching places." });
  }
});

// ➕ POST: create place (admin only later if needed)
router.post("/", auth, async (req, res) => {
  try {
    const place = new Place(req.body);
    await place.save();
    res.status(201).json(place);
  } catch (err) {
    console.error("❌ Failed to create place:", err);
    res.status(500).json({ message: "Error creating place." });
  }
});

export default router;
