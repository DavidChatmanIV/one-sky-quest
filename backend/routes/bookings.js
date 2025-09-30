import { Router } from "express";
import seed from "../data/bookings.mock.json" assert { type: "json" };
import { uuid } from "../utils/id.js";

const store = Array.isArray(seed) ? [...seed] : [];

export default Router()
  .get("/bookings", (req, res) => {
    const limit = Number(req.query.limit || 10);
    res.json(store.slice(0, limit));
  })
  .post("/bookings", (req, res) => {
    const b = { id: uuid(), ...req.body, createdAt: Date.now() };
    store.unshift(b);
    res.status(201).json(b);
  });
