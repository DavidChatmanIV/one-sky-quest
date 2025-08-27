import { Router } from "express";
export default Router().get("/healthz", (req, res) =>
  res.json({ status: "ok", ts: Date.now() })
);
