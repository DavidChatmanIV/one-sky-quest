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
// IMPORTANT: match the actual filename casing on disk (Render/Linux is case-sensitive)
import Contact from "./models/contact.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// ---------- AUTH RATE LIMITING ----------
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
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

// support comma-separated list for prod
const allowedOrigins = FRONTEND_ORIGIN.split(",").map((s) => s.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // server-to-server, Postman, same-origin
      const ok = allowedOrigins.some(
        (o) => origin === o || origin.startsWith(o)
      );
      return ok ? cb(null, true) : cb(new Error("CORS blocked"));
    },
    credentials: true,
  })
);

// ---------- Global Rate Limit (API) ----------
app.use(
  "/api",
  rateLimit({
    windowMs: 60_000, // 1 min
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ---------- TEMP env probe (remove after confirming on Render) ----------
app.get("/__envcheck", (_req, res) => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "";
  res.json({
    present: !!uri,
    sample: uri ? uri.slice(0, 16) + "..." + uri.slice(-6) : "not set",
  });
});

// ---------- Mongo ----------
const USE_MOCKS = process.env.USE_MOCKS === "true";
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const MONGO_DB = process.env.MONGODB_DB || process.env.MONGO_DB;

async function connectMongo() {
  if (USE_MOCKS) {
    console.log("ℹ️ USE_MOCKS=true — skipping Mongo.");
    return;
  }

  if (!MONGO_URI) {
    console.error("❌ Missing MONGODB_URI / MONGO_URI.");
    process.exit(1);
  }

  const opts = {
    dbName: MONGO_DB || undefined,
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 7_000,
    socketTimeoutMS: 60_000,
  };

  try {
    await mongoose.connect(MONGO_URI, opts);
    const c = mongoose.connection;
    console.log(`✅ Mongo connected (db: ${c.name})`);

    c.on("error", (e) => console.error("❌ Mongo error:", e.message));
    c.on("disconnected", () => console.warn("⚠️ Mongo disconnected"));
  } catch (err) {
    console.error("❌ Mongo connect failed:", err.message);
    process.exit(1);
  }
}

// ---------- Health (DB ping) ----------
app.get("/health/db", async (_req, res) => {
  try {
    if (USE_MOCKS) return res.json({ ok: true, mocked: true });

    await mongoose.connection.db.admin().ping();
    res.json({ ok: true, state: mongoose.connection.readyState });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ---------- Root + Routes ----------
app.get("/", (_req, res) => res.send("🚀 One Sky Quest backend is running!"));

app.use("/health", healthRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", apiRouter);

// ---------- Contact example ----------
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

    const doc = new Contact({ name, email, message });
    await doc.save();

    res.json({ ok: true, message: "Thank you for contacting us!" });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ error: "Contact form failed. Try again." });
  }
});

// ---------- 404 + error ----------
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

// expose io to routes so you can do: const io = req.app.get("io");
app.set("io", io);

// Optional: in-memory online users map
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔥 Socket connected", socket.id);

  // DM namespace used by DmPage.jsx
  socket.on("dm:join", ({ conversationId }) => {
    if (!conversationId) return;
    socket.join(String(conversationId));
    console.log(`Socket ${socket.id} joined DM room ${conversationId}`);
  });

  socket.on("dm:typing", ({ conversationId, fromUserId }) => {
    if (!conversationId) return;
    socket.to(String(conversationId)).emit("dm:typing", { fromUserId });
  });

  // Alias from older code (joinConversation)
  socket.on("joinConversation", (conversationId) => {
    if (!conversationId) return;
    socket.join(String(conversationId));
    console.log(
      `Socket ${socket.id} joined conversation (alias) ${conversationId}`
    );
  });

  // ✅ Generic conversation join (from newer server.js)
  socket.on("join_conversation", ({ conversationId, userId }) => {
    if (!conversationId) return;
    socket.join(String(conversationId));
    if (userId) {
      onlineUsers.set(socket.id, {
        userId,
        conversationId: String(conversationId),
      });
    }
    console.log(
      `[socket] user ${userId || "anon"} joined room ${conversationId}`
    );
  });

  //  Broadcast a new message to everyone else in the room
  socket.on("send_message", (payload) => {
    const { conversationId } = payload || {};
    if (!conversationId) return;
    socket.to(String(conversationId)).emit("message_received", payload);
  });

  // Typing indicators (generic)
  socket.on("typing", ({ conversationId, user }) => {
    if (!conversationId) return;
    socket.to(String(conversationId)).emit("typing", { conversationId, user });
  });

  socket.on("stop_typing", ({ conversationId, user }) => {
    if (!conversationId) return;
    socket
      .to(String(conversationId))
      .emit("stop_typing", { conversationId, user });
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.id);
    console.log("❌ Socket disconnected", socket.id);
  });
});

// ---------- Graceful shutdown ----------
async function shutdown(signal) {
  console.log(`🛑 ${signal} received, closing server...`);
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

// ---------- Start Server ----------
await connectMongo();

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 API running on :${PORT} (mocks: ${USE_MOCKS})`);
});

export { app, io, httpServer };
