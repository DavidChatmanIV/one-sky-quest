import { Router } from "express";
import { loadMock } from "./_utils/mock.js";
import { randomUUID as uuid } from "crypto";

export default Router()
  // list posts
  .get("/feed", async (req, res) => {
    const posts = await loadMock("feed", []); // expects feed.mock.json (array)
    res.json(posts);
  })
  // get single post
  .get("/feed/:id", async (req, res) => {
    const posts = await loadMock("feed", []);
    const found = posts.find((p) => String(p.id) === String(req.params.id));
    if (!found) return res.status(404).json({ error: "Not found" });
    res.json(found);
  })
  // create post (mock)
  .post("/feed", async (req, res) => {
    const body = req.body || {};
    const post = { id: uuid(), ...body, ts: Date.now() };
    res.status(201).json(post);
  });
