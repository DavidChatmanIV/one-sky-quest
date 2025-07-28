require("dotenv").config();

// 📦 Dependencies
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ✅ Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*", // 🔁 Replace with your frontend domain in production
    methods: ["GET", "POST"],
  },
});

// 🌍 Port
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

// 📂 Load Models

require("./models/User");
require("./models/Admin");
require("./models/Booking");
require("./models/Contact");
require("./models/Profile");
require("./models/Messages");

// 🛣️ API Routes

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes); 

app.use("/api", require("./routes/booking.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/admin", require("./routes/adminProtected"));
app.use("/api/admin/users", require("./routes/user.routes"));
app.use("/api/flights", require("./routes/flight.routes"));
app.use("/api/hotels", require("./routes/hotel.routes"));
app.use("/api/packages", require("./routes/package.routes"));
app.use("/api/cars", require("./routes/car.routes"));
app.use("/api/cruises", require("./routes/cruise.route"));
app.use("/api/places", require("./routes/placeroutes"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/conversations", require("./routes/conversations"));
app.use("/api/upload", require("./routes/upload"));

app.use("/uploads", express.static("uploads"));

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

// 👤 Public Profile Fetch
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

// 🔌 Socket.io Events

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  // 🌍 Quest Feed
  socket.on("new_post", (postData) => {
    socket.broadcast.emit("receive_post", postData);
  });

  // 💬 Global Message
  socket.on("send_message", (msg) => {
    socket.broadcast.emit("receive_message", msg);
  });

  // ✅ Seen Status
  socket.on("seen_messages", ({ from, to }) => {
    socket.broadcast.emit("message_seen", { from, to });
  });

  // 🔒 Join Room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`👥 User joined room: ${roomId}`);
  });

  // 📩 Direct Message
  socket.on("sendMessage", ({ roomId, message }) => {
    io.to(roomId).emit("receiveMessage", message);
  });

  // ✍️ Typing Indicators
  socket.on("typing", ({ roomId, sender }) => {
    socket.to(roomId).emit("showTyping", sender);
  });

  socket.on("stopTyping", ({ roomId, sender }) => {
    socket.to(roomId).emit("hideTyping", sender);
  });

  // ❌ Disconnect
  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// 🚀 Launch Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
