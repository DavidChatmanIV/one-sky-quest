import { Router } from "express";
import { randomUUID as uuid } from "crypto";
import { loadMock } from "./_utils/mock.js";

const router = Router();
const USE_MOCKS = process.env.USE_MOCKS !== "false";

// --- Lazy-load Mongoose model only if we're not using mocks ---
let PlaceModel = null;
async function getPlaceModel() {
  if (USE_MOCKS) return null;
  if (PlaceModel) return PlaceModel;
  try {
    const mod = await import("../models/Place.js");
    PlaceModel = mod.default || mod.Place || mod;
  } catch {
    PlaceModel = null;
  }
  return PlaceModel;
}

// --- In-memory store bootstrapped from optional places.mock.json ---
let memBootstrapped = false;
let mem = { places: [] };

async function ensureMem() {
  if (!memBootstrapped) {
    const data = await loadMock("places", []); // expects an array
    mem.places = Array.isArray(data) ? data : [];
    memBootstrapped = true;
  }
  return mem;
}

function ciEq(a = "", b = "") {
  return String(a).toLowerCase() === String(b).toLowerCase();
}

/* =========================================================================
   GET /places  (list with optional filters: city, country, type, limit)
   ========================================================================= */
router.get("/", async (req, res) => {
  const { city, country, type, limit } = req.query;

  try {
    const Model = await getPlaceModel();
    if (Model) {
      const q = {};
      if (city) q.city = new RegExp(`^${String(city)}$`, "i");
      if (country) q.country = new RegExp(`^${String(country)}$`, "i");
      if (type) q.type = new RegExp(`^${String(type)}$`, "i");

      let cursor = Model.find(q);
      if (limit) cursor = cursor.limit(Number(limit) || 0);
      const places = await cursor.exec();
      return res.json({ success: true, places });
    }

    const store = await ensureMem();
    let items = [...store.places];
    if (city) items = items.filter((x) => ciEq(x.city, city));
    if (country) items = items.filter((x) => ciEq(x.country, country));
    if (type) items = items.filter((x) => ciEq(x.type, type));
    const lim = Number(limit) || items.length;
    return res.json({ success: true, places: items.slice(0, lim) });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch places", error: err.message });
  }
});

/* =========================================================================
   GET /places/:id
   ========================================================================= */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const Model = await getPlaceModel();
    if (Model) {
      const found = await Model.findById(id);
      if (!found) return res.status(404).json({ error: "Not found" });
      return res.json(found);
    }

    const store = await ensureMem();
    const found = store.places.find(
      (p) => String(p._id ?? p.id) === String(id)
    );
    if (!found) return res.status(404).json({ error: "Not found" });
    return res.json(found);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch place", error: err.message });
  }
});

/* =========================================================================
   POST /places
   ========================================================================= */
router.post("/", async (req, res) => {
  const { name, country, description, city, type } = req.body || {};
  if (!name || !country) {
    return res.status(400).json({ message: "Name and country are required." });
  }

  try {
    const Model = await getPlaceModel();
    if (Model) {
      // case-insensitive uniqueness by name
      const exists = await Model.findOne({
        name: new RegExp(`^${name}$`, "i"),
      });
      if (exists) {
        return res
          .status(409)
          .json({ message: "Place with this name already exists." });
      }
      const created = await Model.create({
        name,
        country,
        description,
        city,
        type,
      });
      return res.status(201).json({ message: "Place added", data: created });
    }

    const store = await ensureMem();
    const dup = store.places.find((p) => ciEq(p.name, name));
    if (dup) {
      return res
        .status(409)
        .json({ message: "Place with this name already exists." });
    }
    const doc = {
      _id: uuid(),
      name,
      country,
      description: description || "",
      city: city || "",
      type: type || "",
      createdAt: Date.now(),
    };
    store.places.push(doc);
    return res.status(201).json({ message: "Place added", data: doc });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to add place", error: err.message });
  }
});

/* =========================================================================
   PATCH /places/:id
   ========================================================================= */
router.patch("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const Model = await getPlaceModel();
    if (Model) {
      const updated = await Model.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updated) return res.status(404).json({ message: "Place not found" });
      return res.json({ message: "Place updated", data: updated });
    }

    const store = await ensureMem();
    const i = store.places.findIndex(
      (p) => String(p._id ?? p.id) === String(id)
    );
    if (i === -1) return res.status(404).json({ message: "Place not found" });
    store.places[i] = {
      ...store.places[i],
      ...req.body,
      updatedAt: Date.now(),
    };
    return res.json({ message: "Place updated", data: store.places[i] });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to update place", error: err.message });
  }
});

/* =========================================================================
   DELETE /places/:id
   ========================================================================= */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const Model = await getPlaceModel();
    if (Model) {
      const deleted = await Model.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: "Place not found" });
      const count = await Model.countDocuments();
      return res.json({ message: "Place deleted", count });
    }

    const store = await ensureMem();
    const before = store.places.length;
    store.places = store.places.filter(
      (p) => String(p._id ?? p.id) !== String(id)
    );
    if (store.places.length === before)
      return res.status(404).json({ message: "Place not found" });
    return res.json({ message: "Place deleted", count: store.places.length });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to delete place", error: err.message });
  }
});

export default router;
