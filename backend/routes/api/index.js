import { Router } from "express";

const api = Router();

/**
 * Safely import & mount an Express router.
 * - Tries each candidate path until one works.
 * - If none exist, logs a warning but does NOT crash.
 * - Works with default export (common for Express routers).
 */
async function safeUse(routeBase, candidateModulePaths) {
  for (const p of candidateModulePaths) {
    try {
      const mod = await import(p);
      const router = mod.default || mod;
      if (typeof router === "function") {
        api.use(routeBase, router);
        console.log(`[api] Mounted ${routeBase} ← ${p}`);
        return;
      }
      console.warn(`[api] ${p} did not export a router function; skipping.`);
    } catch (err) {
      // Silently try next candidate if it's a "not found"; log others.
      if (err?.code !== "ERR_MODULE_NOT_FOUND") {
        console.error(`[api] Error mounting ${routeBase} from ${p}:`, err);
      }
    }
  }
  console.warn(
    `[api] Skipped ${routeBase}: no matching route file found in: ${candidateModulePaths.join(
      ", "
    )}`
  );
}

// --- Mount your routes here ---
// Adjust the candidate lists to match your repo. Keep likely names/casing first.

await safeUse("/auth", ["../auth.routes.js", "../authRoutes.js"]);

await safeUse("/admin", ["../admin.routes.js", "../adminRoutes.js"]);

await safeUse("/admin-auth", [
  "../adminAuth.routes.js",
  "../admin-auth.routes.js",
]);

await safeUse("/admin-protected", [
  "../adminProtected.js",
  "../admin.protected.js",
]);

await safeUse("/booking", ["../booking.routes.js", "../bookingRoutes.js"]);

await safeUse("/car", ["../car.routes.js", "../carRoutes.js"]);

await safeUse("/comments", ["../comments.js", "../comment.routes.js"]);

await safeUse("/conversations", [
  "../conversations.js",
  "../conversation.routes.js",
]);

await safeUse("/cruise", ["../cruise.route.js", "../cruise.routes.js"]);

await safeUse("/dm", ["../dm.js", "../dm.routes.js"]);

await safeUse("/feed", ["../feed.js", "../feed.routes.js"]);

await safeUse("/flight", ["../flight.routes.js", "../flights.routes.js"]);

await safeUse("/health", ["../health.routes.js", "../health.js"]);

await safeUse("/hotel", ["../hotel.routes.js", "../hotels.routes.js"]);

await safeUse("/message", [
  "../message.routes.js",
  "../messages.js", // only if this actually exports a router
]);

await safeUse("/notification", [
  "../notification.routes.js",
  "../notifications.routes.js",
]);

await safeUse("/package", ["../package.routes.js", "../pkg.routes.js"]);

await safeUse("/place", ["../place.routes.js", "../placeRoutes.js"]);

// Root of the API namespace
api.get("/", (_req, res) => {
  res.json({ ok: true, api: "One Sky Quest API root" });
});

export default api;
