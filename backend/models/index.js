import { Router } from "express";

// Tolerant imports (handles ESM default export, named `router`, or CJS export)
const pick = (mod) => mod?.default ?? mod?.router ?? mod;

// Route modules (keep paths/casing EXACT)
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

const admin = pick(adminMod);
const adminAuth = pick(adminAuthMod);
const adminProtected = pick(adminProtectedMod);
const booking = pick(bookingMod);
const car = pick(carMod);
const comments = pick(commentsMod);
const conversations = pick(conversationsMod);
const cruise = pick(cruiseMod);
const dm = pick(dmMod);
const feed = pick(feedMod);
const flight = pick(flightMod);
const health = pick(healthMod);
const hotel = pick(hotelMod);
const message = pick(messageMod);
const notification = pick(notificationMod);
const pkg = pick(pkgMod);
const place = pick(placeMod);

const api = Router();

// Root check
api.get("/", (_req, res) => {
  res.json({ ok: true, api: "One Sky Quest API root" });
});

// Only mount if the module resolved to a Router
if (admin) api.use("/admin", admin);
if (adminAuth) api.use("/admin-auth", adminAuth);
if (adminProtected) api.use("/admin-protected", adminProtected);
if (booking) api.use("/booking", booking);
if (car) api.use("/car", car);
if (comments) api.use("/comments", comments);
if (conversations) api.use("/conversations", conversations);
if (cruise) api.use("/cruise", cruise);
if (dm) api.use("/dm", dm);
if (feed) api.use("/feed", feed);
if (flight) api.use("/flight", flight);
if (health) api.use("/health", health);
if (hotel) api.use("/hotel", hotel);
if (message) api.use("/message", message);
if (notification) api.use("/notification", notification);
if (pkg) api.use("/package", pkg);
if (place) api.use("/place", place);

export default api;
