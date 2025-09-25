import { Router } from "express";
import { loadMock } from "./_utils/mock.js";
import { randomUUID as uuid } from "crypto";

export default Router()
  .get("/profile/:userId", async (req, res) => {
    const profiles = await loadMock("profiles", []);
    const found = profiles.find(
      (p) => String(p.userId) === String(req.params.userId)
    );
    if (!found) return res.status(404).json({ error: "Not found" });
    res.json(found);
  })
  .post("/profile", (req, res) => {
    const profile = { id: uuid(), ...req.body, updatedAt: Date.now() };
    res.status(201).json(profile);
  })
  .patch("/profile/:userId", (req, res) => {
    const patch = {
      ...req.body,
      userId: req.params.userId,
      updatedAt: Date.now(),
    };
    res.json(patch);
  });
