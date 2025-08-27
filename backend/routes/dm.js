import { Router } from "express";
import dm from "../data/dm.mock.json" assert { type: "json" };
import { uuid } from "../utils/id.js";

export default Router()
  .post("/dm/conversations", (req, res) =>
    res.status(201).json({ id: uuid(), ...req.body })
  )
  .get("/dm/messages/:conversationId", (req, res) =>
    res.json(dm.messages)
  )
  .post("/dm/messages/:conversationId", (req, res) =>
    res.status(201).json({ id: uuid(), ...req.body, ts: Date.now() })
  );
