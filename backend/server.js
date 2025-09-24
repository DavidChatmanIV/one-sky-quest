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

// Routes
import apiRouter from "./routes/index.js";
import health from "./routes/health.routes.js";
import Contact from "./models/Contact.js";

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", 1); // Render/Proxies

// ---------- Core middleware ----------
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

// Morgan request logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ---------- CORS ----------
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const allowedOrigins = FRONTEND_ORIGIN.split(",").map((s) => s.trim());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // e.g., curl/postman
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

// ---------- Mongo connection ----------
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB = process.env.MONGO_DB || "osq";
if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in environment");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { dbName: MONGO_DB })
  .then(() => console.log("✅ Mongo connected"))
  .catch((err) => {
    console.error("❌ Mongo connection error:", err);
    process.exit(1);
  });

// ---------- Routes ----------
app.get("/", (_req, res) => {
  res.send("🚀 One Sky Quest backend is running!");
});

app.use("/health", health);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", apiRouter);

// Legacy contact form (kept from your code)
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing name, email, or message" });
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
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
});

// ---------- Start ----------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 API running on :${PORT}`));
