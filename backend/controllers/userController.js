const User = require("../models/User");

exports.getProfile = async (req, res) => {
<<<<<<< HEAD
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
=======
try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
    return res.status(404).json({ message: "User not found." });
>>>>>>> origin/fresh-start
    }

    res.json({
    success: true,
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "Traveler",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
<<<<<<< HEAD
      },
    });
  } catch (error) {
=======
    },
    });
} catch (error) {
>>>>>>> origin/fresh-start
    console.error("Error loading profile:", error);
    res.status(500).json({ message: "Server error while loading profile." });
  }
};
