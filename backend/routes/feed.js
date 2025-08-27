import { Router } from "express";
import feed from "../data/feed.mock.json" assert { type: "json" };
import { uuid } from "../utils/id.js";

export default Router()
  .get("/feed/trending", (req, res) => res.json(feed.trending))
  .post("/feed/posts", (req, res) =>
    res.status(201).json({ id: uuid(), ...req.body, ts: Date.now() })
  )
  .post("/feed/posts/:id/react", (req, res) =>
    res.json({ id: req.params.id, ...req.body })
  );
