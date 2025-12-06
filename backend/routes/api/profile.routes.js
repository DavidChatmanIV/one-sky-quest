import { Router } from "express";
import Profile from "../../models/profile.js"; // note: ../../ because we're in routes/api/
import User from "../../models/user.js";
import authRequired from "../../middleware/authRequired.js";

const router = Router();

/**
 * GET /api/profile/me
 * Return the currently logged-in user (from JWT)
 */
router.get("/me", authRequired, async (req, res) => {
  try {
    // req.user.id is set by authRequired
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use toSafeJSON if available from your merged User model
    const safeUser =
      typeof user.toSafeJSON === "function"
        ? user.toSafeJSON()
        : {
            id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            bio: user.bio,
            xp: user.xp,
            createdAt: user.createdAt,
          };

    return res.json({ user: safeUser });
  } catch (err) {
    console.error("[profile] GET /me error:", err);
    return res.status(500).json({ message: "Failed to load current user" });
  }
});

/**
 * GET /api/profile/:id
 * Fetch a profile by MongoDB ObjectId
 */
router.get("/:id", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error("[profile] GET /:id error:", err);
    res.status(500).json({ message: "Server error loading profile" });
  }
});

/**
 * POST /api/profile
 * Create a new profile
 */
router.post("/", async (req, res) => {
  try {
    const newProfile = new Profile(req.body);
    await newProfile.save();

    res.status(201).json(newProfile);
  } catch (err) {
    console.error("[profile] POST / error:", err);
    res
      .status(400)
      .json({ message: "Error creating profile", details: err.message });
  }
});

/**
 * PATCH /api/profile/:id
 * Update an existing profile
 */
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Profile.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("[profile] PATCH /:id error:", err);
    res
      .status(400)
      .json({ message: "Error updating profile", details: err.message });
  }
});

export default router;
