import { Router } from "express";

const api = Router();

// Helper to normalize CommonJS / ESM / named exports
const pick = (mod) => mod?.default ?? mod?.router ?? mod;

// Helper to verify Express Router-like objects
const isRouterLike = (r) =>
  typeof r === "function" && typeof r.use === "function";

const mount = (path, mod) => {
  const router = pick(mod);
  if (isRouterLike(router)) {
    api.use(path, router);
    console.log(`[api] Mounted ${path}`);
  } else {
    console.warn(`[api] Skipped ${path}: module did not export a valid Router`);
  }
};

// -------- Import route modules (adjust paths to your project) --------
// IMPORTANT: Filenames must match exactly (Render = Linux = case-sensitive)

import * as adminMod from "../admin.routes.js";
import * as adminAuthMod from "../adminAuth.routes.js";
import * as adminProtectedMod from "../adminProtected.js";
import * as bookingMod from "../booking.routes.js";
import * as carMod from "../car.routes.js";
import * as commentsMod from "../comments.js";
import * as conversationsMod from "../conversations.js";
import * as cruiseMod from "../cruise.route.js";
import * as dmMod from "../dm.js";
import * as feedMod from "../feed.js";
import * as flightMod from "../flight.routes.js";
import * as healthMod from "../health.routes.js";
import * as hotelMod from "../hotel.routes.js";
import * as messageMod from "../message.routes.js";
import * as notificationMod from "../notification.routes.js";
import * as pkgMod from "../package.routes.js";
import * as placeMod from "../place.routes.js";

// -------- Root check --------
api.get("/", (_req, res) => {
  res.json({ ok: true, api: "One Sky Quest API root" });
});

// -------- Mount routes safely --------
mount("/admin", adminMod);
mount("/admin-auth", adminAuthMod);
mount("/admin-protected", adminProtectedMod);
mount("/booking", bookingMod);
mount("/car", carMod);
mount("/comments", commentsMod);
mount("/conversations", conversationsMod);
mount("/cruise", cruiseMod);
mount("/dm", dmMod);
mount("/feed", feedMod);
mount("/flight", flightMod);
mount("/health", healthMod);
mount("/hotel", hotelMod);
mount("/message", messageMod);
mount("/notification", notificationMod);
mount("/package", pkgMod);
mount("/place", placeMod);

export default api;
