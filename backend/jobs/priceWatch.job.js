import Watch from "../models/Watch.js";
import Notification from "../models/Notification.js";

/**
 * Mock price generator (MVP)
 * - creates small random movement
 * - always >= 50
 */
function mockGetCurrentPrice(watch) {
  const base =
    typeof watch.lastSeenPrice === "number" && watch.lastSeenPrice !== null
      ? watch.lastSeenPrice
      : 1200;

  const delta = Math.floor(Math.random() * 120 - 60); // -60..+60
  return Math.max(50, base + delta);
}

/**
 * Runs one pass:
 * - checks active watches
 * - if price dropped vs lastSeenPrice => creates notification
 * - updates lastSeenPrice
 *
 * Safe guards:
 * - limit batch
 * - minimal fields
 */
export async function runPriceWatchOnce({ limit = 500, dryRun = false } = {}) {
  const watches = await Watch.find({ active: true })
    .limit(limit)
    .select("userId destination lastSeenPrice")
    .lean(false); // keep as docs so we can save()

  for (const w of watches) {
    const current = mockGetCurrentPrice(w);

    const hadPrice =
      typeof w.lastSeenPrice === "number" && w.lastSeenPrice !== null;

    const dropped = hadPrice && current < w.lastSeenPrice;

    if (dropped) {
      const diff = w.lastSeenPrice - current;

      if (!dryRun) {
        await Notification.create({
          userId: w.userId,
          type: "PRICE_DROP",
          title: "Price dropped ✈️",
          body: `${
            w.destination || "Your trip"
          } is down $${diff} (now $${current})`,
          deepLink: "/booking",
        });
      }
    }

    // update price baseline so tomorrow we compare correctly
    if (!dryRun) {
      w.lastSeenPrice = current;
      await w.save();
    }
  }

  return { checked: watches.length };
}