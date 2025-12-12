import { Router } from "express";
import User from "../models/user.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = Router();

/**
 * 🧑‍✈️ GET /api/admin/users
 * List all users (admin-only).
 */
router.get("/users", verifyAdmin, async (_req, res) => {
  try {
    const users = await User.find({})
      // whitelist only safe fields; adjust if your schema differs
      .select("name username email role createdAt updatedAt isActive")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error("[admin] Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users." });
  }
});

/**
 * 🧑‍💼 GET /api/admin/staff
 * List only staff/admin accounts (support, manager, admin).
 */
router.get("/staff", verifyAdmin, async (_req, res) => {
  try {
    const staff = await User.find({
      role: { $in: ["support", "manager", "admin"] },
    })
      .select("name username email role createdAt updatedAt isActive")
      .sort({ createdAt: -1 });

    res.json(staff);
  } catch (err) {
    console.error("[admin] Failed to load staff/admins:", err);
    res.status(500).json({ message: "Error loading staff/admins." });
  }
});

/**
 * 🛠️ PATCH /api/admin/users/:id/role
 * Change a user's role (admin-only).
 *
 * Expected body: { "role": "user" | "support" | "manager" | "admin" }
 */
router.patch("/users/:id/role", verifyAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    // Match your User schema enum: ["user", "support", "manager", "admin"]
    const allowedRoles = ["user", "support", "manager", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("name username email role createdAt updatedAt isActive");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("[admin] Error updating user role:", err);
    res.status(500).json({ message: "Error updating user role" });
  }
});

export default router;
