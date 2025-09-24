import { Router } from 'express';
import mongoose from 'mongoose';

const r = Router();

const mongoState = () => {
  const state = mongoose.connection?.readyState ?? 0;
  const map = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  return { code: state, status: map[state] || "unknown" };
};

r.get('/', (_req, res) => {
  res.json({
    ok: true,
    env: process.env.NODE_ENV || 'dev',
    time: new Date().toISOString(),
    uptimeSec: Math.round(process.uptime()),
    mongo: mongoState(),
  });
});

export default r;
