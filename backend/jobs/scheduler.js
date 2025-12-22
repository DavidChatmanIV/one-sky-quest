import mongoose from "mongoose";
import { runPriceWatchOnce } from "./priceWatch.job.js";

const DAY_MS = 24 * 60 * 60 * 1000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function startJobs() {
  const USE_MOCKS = process.env.USE_MOCKS === "true";

  // Don’t run in mock mode
  if (USE_MOCKS) {
    console.log("ℹ️ Jobs disabled (USE_MOCKS=true)");
    return;
  }

  // Optional kill-switch for production
  if (process.env.RUN_JOBS === "false") {
    console.log("ℹ️ Jobs disabled (RUN_JOBS=false)");
    return;
  }

  let running = false;

  const tick = async () => {
    // Prevent overlap if a run takes too long
    if (running) return;
    running = true;

    try {
      // If DB not ready, skip this tick
      if (mongoose.connection.readyState !== 1) {
        console.log("⚠️ Jobs skipped (DB not ready)");
        return;
      }

      const result = await runPriceWatchOnce();
      console.log(`✅ priceWatch checked=${result.checked}`);
    } catch (e) {
      console.error("❌ priceWatch job error:", e?.message || e);
    } finally {
      running = false;
    }
  };

  // Run once shortly after startup (optional, safer than immediate)
  (async () => {
    await sleep(10_000);
    tick();
  })();

  // Then every 24 hours
  setInterval(tick, DAY_MS);

  console.log("🕒 Jobs started (price watch daily)");
}