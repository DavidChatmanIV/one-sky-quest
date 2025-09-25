import { Router } from "express";

// Auth (new style)
import authRouter from "../auth.routes.js";

// Other route modules (ensure each file uses ESM and default-exports a Router)
import admin from "../admin.routes.js";
import adminAuth from "../adminAuth.routes.js";
import adminProtected from "../adminProtected.js";
import booking from "../booking.routes.js";
import car from "../car.routes.js";
import comments from "../comments.js";
import conversations from "../conversations.js";
import cruise from "../cruise.route.js";
import dm from "../dm.js";
import feed from "../feed.js";
import flight from "../flight.routes.js";
import health from "../health.routes.js";
import hotel from "../hotel.routes.js";
import message from "../message.routes.js";
import messages from "../messages.js";
import notification from "../notification.routes.js";
import pkg from "../package.routes.js";
import place from "../placeroutes.js";

const api = Router();

// Basic index route
api.get("/", (_req, res) => {
  res.json({ ok: true, api: "One Sky Quest API root" });
});

// Mount routes
api.use("/auth", authRouter); // new style import
api.use("/admin", admin);
api.use("/admin-auth", adminAuth);
api.use("/admin-protected", adminProtected);
api.use("/bookings", booking);
api.use("/cars", car);
api.use("/comments", comments);
api.use("/conversations", conversations);
api.use("/cruise", cruise);
api.use("/dm", dm);
api.use("/feed", feed);
api.use("/flights", flight);
api.use("/health", health);
api.use("/hotels", hotel);
api.use("/message", message);
api.use("/messages", messages);
api.use("/notifications", notification);
api.use("/packages", pkg);
api.use("/places", place);

export default api;
