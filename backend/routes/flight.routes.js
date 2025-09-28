import { Router } from "express";
import { Flight } from "../models/index.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// 📖 GET: all flights
router.get("/", async (_req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    console.error("❌ Failed to fetch flights:", err);
    res.status(500).json({ message: "Error fetching flights." });
  }
});

// ➕ POST: create flight (admin only later if needed)
router.post("/", auth, async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (err) {
    console.error("❌ Failed to create flight:", err);
    res.status(500).json({ message: "Error creating flight." });
  }
});

export default router;
