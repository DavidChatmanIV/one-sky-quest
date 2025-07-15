require("dotenv").config();

// 📦 Dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔧 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔌 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 📂 Optional Models (for seeding or internal use)
require("./models/Booking");
require("./models/Contact");
require("./models/Profile");

// 🛣️ Route Imports
app.use("/api", require("./routes/auth.routes"));
app.use("/api", require("./routes/booking.routes"));
app.use("/api/notifications", require("./routes/notification.routes")); // ✅ Notifications
app.use("/api/admin", require("./routes/adminProtected"));
app.use("/api/admin/users", require("./routes/user.routes"));
app.use("/api/flights", require("./routes/flight.routes"));
app.use("/api/hotels", require("./routes/hotel.routes"));
app.use("/api/packages", require("./routes/package.routes"));
app.use("/api/cars", require("./routes/car.routes"));
app.use("/api/cruises", require("./routes/cruise.route"));
app.use("/api/places", require("./routes/placeroutes"));

// 📬 Contact Form
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const Contact = require("./models/Contact");
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.send("Thank you for contacting us!");
  } catch (err) {
    console.error("❌ Contact error:", err);
    res.status(500).send("Contact form failed. Try again.");
  }
});

// 👤 Public Profile by Username
app.get("/api/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const Profile = require("./models/Profile");
    const profile = await Profile.findOne({ username });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error("❌ Profile fetch error:", err);
    res.status(500).json({ message: "Server error fetching profile." });
  }
});

// 🌐 Serve Frontend (Production Only)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (_, res) =>
    res.sendFile(path.join(__dirname, "../client/dist/index.html"))
  );
}

// 🚀 Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
