const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id; // support either shape from auth middleware
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
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
      },
    });
  } catch (error) {
    console.error("Error loading profile:", error);
    res.status(500).json({ message: "Server error while loading profile." });
  }
};
