import { Router } from "express";

const api = Router();

/**
 * Try to import and mount a router.
 * - No "skipped" noise if file doesn't exist.
 * - Logs a single clean line when mounted.
 */
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
    // Ignore "module not found" quietly; surface real errors.
    if (err?.code !== "ERR_MODULE_NOT_FOUND") {
      console.error(
        `[api] Error mounting ${routeBase} from ${modulePath}:`,
        err
      );
    }
  }
}

/**
 * Only list the files you actually have right now.
 * Add more lines as you create/fix those route files.
 */
await mount("/auth", "../auth.routes.js");
await mount("/conversations", "../conversations.js");
await mount("/feed", "../feed.js");
await mount("/health", "../health.routes.js");
await mount("/message", "../message.routes.js");

/**
 * If you've fixed these to ESM and confirmed filenames, uncomment:
 *
 * await mount("/dm", "../dm.js");
 * await mount("/booking", "../booking.routes.js");
 * await mount("/flight", "../flight.routes.js");
 * await mount("/hotel", "../hotel.routes.js");
 * await mount("/car", "../car.routes.js");
 * await mount("/cruise", "../cruise.routes.js");
 * await mount("/comments", "../comments.js");
 * await mount("/notification", "../notification.routes.js");
 * await mount("/package", "../package.routes.js");
 * await mount("/place", "../place.routes.js");
 * await mount("/admin", "../admin.routes.js");
 * await mount("/admin-auth", "../adminAuth.routes.js");
 * await mount("/admin-protected", "../adminProtected.js");
 */

// Root of the API namespace
api.get("/", (_req, res) => {
  res.json({ ok: true, api: "One Sky Quest API root" });
});

export default api;
