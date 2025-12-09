import { Router } from "express";
import {
  register,
  login,
  checkAuth,
} from "../../controllers/authcontroller.js"; // <- match your actual filename
import authRequired from "../../middleware/authRequired.js";
import { authRateLimiter } from "../../middleware/authRateLimit.js";

const router = Router();

// -------------------------------------
// POST /api/auth/register
// -------------------------------------
router.post("/register", authRateLimiter, register);

// -------------------------------------
// POST /api/auth/login
// -------------------------------------
router.post("/login", authRateLimiter, login);

// -------------------------------------
// GET /api/auth/check
// (Protected: requires Authorization: Bearer <token>)
// -------------------------------------
router.get("/check", authRequired, checkAuth);

export default router;
