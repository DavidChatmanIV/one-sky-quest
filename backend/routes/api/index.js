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

/* ======================================================
   Routes inside: backend/routes/api/
   ====================================================== */
await mount("/auth", "./auth.routes.js");
await mount("/profile", "./profile.routes.js");
await mount("/uploads", "./uploads.routes.js");

// 👥 Social (follow/unfollow, mute official, ensure-official, etc.)
await mount("/social", "./social.routes.js");

// Follow system (ObjectId based)
await mount("/follow", "./follow.routes.js");

// SkyStream feed + Following feed (cursor pagination)
await mount("/skystream", "./skystream.routes.js");

// 🧾 Passport stats
await mount("/passport", "./passport.routes.js");

/* ======================================================
   Routes inside: backend/routes/
   ====================================================== */
await mount("/conversations", "../conversations.js");
await mount("/feed", "../feed.js");
await mount("/health", "../health.js");
await mount("/message", "../message.routes.js");
await mount("/notifications", "../notification.routes.js");
await mount("/bookings", "../bookings.routes.js");
await mount("/dm", "../dm.js");
await mount("/admin", "../admin.routes.js");

/* ======================================================
   Feature Modules
   ====================================================== */
await mount("/hotspots", "../hotspots.js");
await mount("/watches", "../watches.js");
await mount("/xp", "../xp.js");

/* ======================================================
   API Root
   ====================================================== */
api.get("/", (_req, res) => {
  res.json({ ok: true, api: "Skyrio API root" });
});

export default api;