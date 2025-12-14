import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import apiRouter from "./routes/api/index.js";
import healthRouter from "./routes/health.routes.js";
import Contact from "./models/contact.js";

// ---------- Path helpers ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- App ----------
const app = express();
app.set("trust proxy", 1);

// ---------- Core middleware ----------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ---------- AUTH RATE LIMIT ----------
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth", authLimiter);

// ---------- CORS ----------
const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN ||
  process.env.CLIENT_ORIGIN ||
  "http://localhost:5173";

// allow comma-separated origins in prod
const allowedOrigins = FRONTEND_ORIGIN.split(",").map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Postman / server-to-server
      const ok = allowedOrigins.includes(origin);
      return ok ? cb(null, true) : cb(new Error("CORS blocked"));
    },
    credentials: true,
  })
);

// ---------- Global API rate limit ----------
app.use(
  "/api",
  rateLimit({
    windowMs: 60_000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ---------- ENV sanity check (TEMP) ----------
app.get("/__envcheck", (_req, res) => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "";
  res.json({
    present: !!uri,
    sample: uri ? uri.slice(0, 16) + "..." + uri.slice(-6) : "not set",
  });
});

// ---------- Mongo ----------
const USE_MOCKS = process.env.USE_MOCKS === "true";
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const MONGO_DB = process.env.MONGODB_DB || process.env.MONGO_DB;

async function connectMongo() {
  if (USE_MOCKS) {
    console.log("ℹ️ USE_MOCKS=true — skipping MongoDB.");
    return;
  }

  if (!MONGODB_URI) {
    console.error(
      "❌ Missing MONGODB_URI (or MONGO_URI). Check .env / Render variables."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGO_DB || undefined, // remove if db is already in URI
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 7000,
      socketTimeoutMS: 60000,
    });

    const c = mongoose.connection;
    console.log(`✅ MongoDB connected to Skyrio (db: ${c.name})`);

    c.on("error", (e) =>
      console.error("❌ MongoDB connection error:", e.message)
    );
    c.on("disconnected", () => console.warn("⚠️ MongoDB disconnected"));
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

// ---------- Health ----------
app.get("/health/db", async (_req, res) => {
  try {
    if (USE_MOCKS) return res.json({ ok: true, mocked: true });

    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      return res.status(503).json({
        ok: false,
        state: mongoose.connection.readyState,
        error: "DB not ready",
      });
    }

    await mongoose.connection.db.admin().ping();
    return res.json({ ok: true, state: mongoose.connection.readyState });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// ---------- Routes ----------
app.get("/", (_req, res) => res.send("🚀 Skyrio backend is running!"));

app.use("/health", healthRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", apiRouter);

// ---------- Contact ----------
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing name, email, or message" });
    }

    if (USE_MOCKS) {
      return res.json({ ok: true, message: "Received (mock). Thank you!" });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "DB not ready" });
    }

    await new Contact({ name, email, message }).save();
    return res.json({ ok: true, message: "Thank you for contacting us!" });
  } catch (err) {
    console.error("❌ Contact error:", err);
    return res.status(500).json({ error: "Contact form failed." });
  }
});

// ---------- 404 + Error ----------
app.use((req, _res, next) => {
  if (req.path.startsWith("/api")) {
    const err = new Error("Not found");
    err.status = 404;
    return next(err);
  }
  return next();
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Server error",
  });
});

// ---------- HTTP + Socket.io ----------
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

// ---------- Socket logic ----------
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔥 Socket connected", socket.id);

  socket.on("dm:join", ({ conversationId }) => {
    if (!conversationId) return;
    socket.join(String(conversationId));
  });

  socket.on("dm:typing", ({ conversationId, fromUserId }) => {
    if (!conversationId) return;
    socket.to(String(conversationId)).emit("dm:typing", { fromUserId });
  });

  socket.on("join_conversation", ({ conversationId, userId }) => {
    if (!conversationId) return;
    socket.join(String(conversationId));
    if (userId) onlineUsers.set(socket.id, { userId, conversationId });
  });

  socket.on("send_message", (payload) => {
    if (!payload?.conversationId) return;
    socket.to(String(payload.conversationId)).emit("message_received", payload);
  });

  socket.on("typing", ({ conversationId, user }) => {
    if (!conversationId) return;
    socket.to(String(conversationId)).emit("typing", { user });
  });

  socket.on("stop_typing", ({ conversationId, user }) => {
    if (!conversationId) return;
    socket.to(String(conversationId)).emit("stop_typing", { user });
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.id);
    console.log("❌ Socket disconnected", socket.id);
  });
});

// ---------- Graceful shutdown ----------
async function shutdown(signal) {
  console.log(`🛑 ${signal} received, shutting down...`);
  try {
    await mongoose.connection.close().catch(() => {});
    httpServer.close(() => {
      console.log("✅ HTTP server closed");
      process.exit(0);
    });
  } catch {
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// ---------- Start ----------
await connectMongo();

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 API running on :${PORT} (mocks: ${USE_MOCKS})`);
});

export { app, io, httpServer };