import { Router } from "express";

const api = Router();

async function mount(routeBase, modulePath) {
  try {
    const mod = await import(modulePath);
    const router = mod.default || mod;

    if (typeof router === "function") {
      api.use(routeBase, router);
      console.log(`[api] Mounted ${routeBase} ← ${modulePath}`);
    } else {
      console.warn(
        `[api] ${modulePath} did not export a router function; skipping.`
      );
    }
  } catch (err) {
    if (err?.code !== "ERR_MODULE_NOT_FOUND") {
      console.error(
        `[api] Error mounting ${routeBase} from ${modulePath}:`,
        err
      );
    } else {
      console.warn(
        `[api] Optional route not found for ${routeBase} (${modulePath}); skipping.`
      );
    }
  }
}

// ---------- Mount all sub-routers (paths are relative to this file) ----------
await mount("/auth", "../auth.routes.js");
await mount("/conversations", "../conversations.js");
await mount("/feed", "../feed.js");
await mount("/health", "../health.routes.js");
await mount("/message", "../message.routes.js");

// Profile & notifications
await mount("/profile", "../profile.routes.js");
await mount("/notifications", "../notification.routes.js");

// Uploads (images, etc.)
await mount("/uploads", "../uploads.routes.js");

// Bookings router (routes/bookings.routes.js)
await mount("/bookings", "../bookings.routes.js");

// DM alias (if you’re reusing message.routes.js for now)
await mount("/dm", "../message.routes.js");

// Admin routes (role management, user listing, etc.)
await mount("/admin", "../admin.routes.js");

// Root of the API namespace
api.get("/", (_req, res) => {
  res.json({ ok: true, api: "Skyrio API root" });
});

export default api;