require("dotenv").config();

// 📦 Dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 📂 Models (optional, useful if seeding or preloading)
const Booking = require("./models/Booking");
const Contact = require("./models/Contact");
const Profile = require("./models/profile");

// 🛣️ Routes
const flightRoutes = require("./routes/flight.routes");
const hotelRoutes = require("./routes/hotel.routes");
const packageRoutes = require("./routes/package.routes");
const carRoutes = require("./routes/car.routes");
const cruiseRoutes = require("./routes/cruise.route");
const bookingRoutes = require("./routes/booking.routes");
const placeRoutes = require("./routes/placeroutes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/adminProtected");
const userRoutes = require("./routes/user.routes"); // for saved trips, etc.

// 🔧 Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 🔌 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 📁 Serve frontend (optional – for full-stack deployment)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (_, res) =>
    res.sendFile(path.join(__dirname, "../client/dist/index.html"))
  );
}

// 📌 Core API Routes
app.use("/api", authRoutes); // Login, register, etc.
app.use("/api", bookingRoutes); // Public + admin bookings
app.use("/api/admin", adminRoutes); // Admin dashboard protected routes
app.use("/api/admin/users", userRoutes); // Saved trips & admin user list

// 🌍 Travel Routes
app.use("/api/flights", flightRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/cruises", cruiseRoutes);
app.use("/api/places", placeRoutes);

// 📬 Contact Form Submission
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.send("Thank you for contacting us!");
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).send("Contact form failed. Try again.");
  }
});

// 👤 Get Public Profile by Username
app.get("/api/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const profile = await Profile.findOne({ username });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error fetching profile." });
  }
});

// 🚀 Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
