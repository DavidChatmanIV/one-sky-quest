import { Router } from "express";
import { Package } from "../models/index.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// 📖 GET: all packages
router.get("/", async (_req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (err) {
    console.error("❌ Failed to fetch packages:", err);
    res.status(500).json({ message: "Error fetching packages." });
  }
});

// ➕ POST: create package (admin only later if needed)
router.post("/", auth, async (req, res) => {
  try {
    const pkg = new Package(req.body);
    await pkg.save();
    res.status(201).json(pkg);
  } catch (err) {
    console.error("❌ Failed to create package:", err);
    res.status(500).json({ message: "Error creating package." });
  }
});

export default router;
