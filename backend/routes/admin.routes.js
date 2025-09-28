import { Router } from "express";
import { Admin } from "../models/index.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = Router();

// 👥 GET: list all admins (superadmin only)
router.get("/", verifyAdmin, async (_req, res) => {
  try {
    const admins = await Admin.find().select("email role");
    res.json(admins);
  } catch (err) {
    console.error("❌ Failed to load admins:", err);
    res.status(500).json({ message: "Error loading admins." });
  }
});

// ➕ POST: create a new admin (superadmin only)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { email, role } = req.body;
    const newAdmin = new Admin({ email, role });
    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (err) {
    console.error("❌ Failed to create admin:", err);
    res.status(500).json({ message: "Error creating admin." });
  }
});

// 🗑️ DELETE: remove admin (superadmin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    res.json({ message: "Admin deleted successfully." });
  } catch (err) {
    console.error("❌ Failed to delete admin:", err);
    res.status(500).json({ message: "Error deleting admin." });
  }
});

export default router;
