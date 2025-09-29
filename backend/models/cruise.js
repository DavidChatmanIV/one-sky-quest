import { Router } from "express";
import { Cruise } from "../models/index.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// 📖 GET: all cruises
router.get("/", async (_req, res) => {
  try {
    const cruises = await Cruise.find();
    res.json(cruises);
  } catch (err) {
    console.error("❌ Failed to fetch cruises:", err);
    res.status(500).json({ message: "Error fetching cruises." });
  }
});

// ➕ POST: create cruise (protect if needed)
router.post("/", auth, async (req, res) => {
  try {
    const cruise = new Cruise(req.body);
    await cruise.save();
    res.status(201).json(cruise);
  } catch (err) {
    console.error("❌ Failed to create cruise:", err);
    res.status(500).json({ message: "Error creating cruise." });
  }
});

// 🗑️ DELETE: remove cruise
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Cruise.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Cruise not found." });
    res.json({ message: "Cruise deleted." });
  } catch (err) {
    console.error("❌ Failed to delete cruise:", err);
    res.status(500).json({ message: "Error deleting cruise." });
  }
});

export default router;
