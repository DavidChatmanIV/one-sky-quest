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

// ---------- Routes ----------
import apiRouter from "./routes/api/index.js";
import healthRouter from "./routes/health.routes.js";
// Prefer using the barrel for models, but direct import is fine too:
import Contact from "./models/contact.js"; // <- lowercase path (Render-safe)

// If you truly have a separate DM router (NOT already mounted in apiRouter), use this:
// import dmRouter from "./routes/dm.js";
// If you truly need a separate places router (NOT already in apiRouter), use this:
// import placesRouter from "./routes/place.routes.js";

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", 1);

// ---------- Core middleware ----------
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

// ---------- Logging ----------
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ---------- CORS ----------
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const allowedOrigins = FRONTEND_ORIGIN.split(",").map((s) => s.trim());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const ok = allowedOrigins.some((o) => origin.startsWith(o));
      cb(ok ? null : new Error("CORS blocked"), ok);
    },
    credentials: true,
  })
);

// ---------- Rate limiting (API only) ----------
app.use(
  "/api",
  rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true })
);

// ---------- Mongo connection (conditional) ----------
const USE_MOCKS = process.env.USE_MOCKS === "true"; // default false → connect
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI; // accept either key
const MONGO_DB = process.env.MONGODB_DB || process.env.MONGO_DB; // optional

async function connectMongo() {
  if (USE_MOCKS) {
    console.log("ℹ️ USE_MOCKS=true — skipping Mongo connection.");
    return;
  }
  if (!MONGO_URI) {
    console.error(
      "❌ Missing MONGODB_URI/MONGO_URI (and USE_MOCKS is not true)."
    );
    process.exit(1);
  }

  const options = {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 7000,
    socketTimeoutMS: 60000,
  };
  if (MONGO_DB) options.dbName = MONGO_DB;

  try {
    await mongoose.connect(MONGO_URI, options);
    const c = mongoose.connection;
    console.log(`✅ Mongo connected (db: ${c.name})`);
    c.on("error", (e) => console.error("❌ Mongo error:", e.message));
    c.on("disconnected", () => console.warn("⚠️ Mongo disconnected"));
  } catch (err) {
    console.error("❌ Mongo connect failed:", err.message);
    process.exit(1);
  }
}

await connectMongo();

// DB health endpoint (good for local + Render)
app.get("/health/db", async (_req, res) => {
  try {
    if (USE_MOCKS) return res.json({ ok: true, mocked: true });
    await mongoose.connection.db.admin().ping();
    res.json({ ok: true, state: mongoose.connection.readyState });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ---------- Routes ----------
app.get("/", (_req, res) => res.send("🚀 One Sky Quest backend is running!"));
app.use("/health", healthRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Single API entrypoint—this already mounts /dm, /places, /messages, etc.
app.use("/api", apiRouter);

// If (and only if) dm or places are NOT included in apiRouter, uncomment these:
// app.use("/api/dm", dmRouter);
// app.use("/api/places", placesRouter);

// Contact form example (writes to Mongo when not mocked)
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

// ---------- 404 + Error handler ----------
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
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// ---------- Start ----------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`🚀 API running on :${PORT} (mocks: ${USE_MOCKS})`)
);
