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
    }
  }
}

await mount("/auth", "../auth.routes.js");
await mount("/conversations", "../conversations.js");
await mount("/feed", "../feed.js");
await mount("/health", "../health.routes.js");
await mount("/message", "../message.routes.js");
await mount("/profile", "../profile.routes.js");

// Root of the API namespace
api.get("/", (_req, res) => {
  res.json({ ok: true, api: "One Sky Quest API root" });
});

export default api;
