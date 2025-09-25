import { Router } from "express";

// Import all route modules
import admin from "./admin.routes.js";
import adminAuth from "./adminAuth.routes.js";
import adminProtected from "./adminProtected.js";
import auth from "./auth.routes.js";
import booking from "./booking.routes.js";
import car from "./car.routes.js";
import comments from "./comments.js";
import conversations from "./conversations.js";
import cruise from "./cruise.route.js";
import dm from "./dm.js";
import feed from "./feed.js";
import flight from "./flight.routes.js";
import health from "./health.routes.js";
import hotel from "./hotel.routes.js";
import message from "./message.routes.js";
import messages from "./messages.js";
import notification from "./notification.routes.js";
import pkg from "./package.routes.js";
import place from "./placeroutes.js";

const router = Router();

// Basic index route
router.get("/", (_req, res) => {
  res.json({ ok: true, api: "One Sky Quest API root" });
});

// Mount each route under a prefix
router.use("/admin", admin);
router.use("/admin-auth", adminAuth);
router.use("/admin-protected", adminProtected);
router.use("/auth", auth);
router.use("/bookings", booking);
router.use("/cars", car);
router.use("/comments", comments);
router.use("/conversations", conversations);
router.use("/cruise", cruise);
router.use("/dm", dm);
router.use("/feed", feed);
router.use("/flights", flight);
router.use("/health", health);
router.use("/hotels", hotel);
router.use("/message", message);
router.use("/messages", messages);
router.use("/notifications", notification);
router.use("/packages", pkg);
router.use("/places", place);

export default router;
