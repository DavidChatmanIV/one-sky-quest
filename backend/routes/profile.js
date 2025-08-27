import { Router } from "express";
import profile from "../data/profile.mock.json" assert { type: "json" };

export default Router()
  .get("/profile/:id", (req, res) => res.json(profile))
  .post("/profile", (req, res) =>
    res.status(201).json({ ...profile, ...req.body })
  )
  .put("/profile", (req, res) =>
    res.json({ ...profile, ...req.body })
  );
