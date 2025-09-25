import { Router } from "express";

export default Router().get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    now: new Date().toISOString(),
    version: process.env.APP_VERSION || "0.1.0",
  });
});
