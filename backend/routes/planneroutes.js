import { Router } from "express";
import { loadMock } from "./_utils/mock.js";
import { randomUUID as uuid } from "crypto";

export default Router()
  .post("/planner/itineraries", (req, res) => {
    const itin = { id: uuid(), ...req.body, createdAt: Date.now() };
    res.status(201).json(itin);
  })
  .get("/planner/itineraries/:id", async (req, res) => {
    const itins = await loadMock("itineraries", []); // itineraries.mock.json (array)
    const found = itins.find((x) => String(x.id) === String(req.params.id));
    if (!found) return res.status(404).json({ error: "Not found" });
    res.json(found);
  });
