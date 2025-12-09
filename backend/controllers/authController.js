import { Router } from "express";
import {
  register,
  login,
  checkAuth,
} from "../../controllers/authcontroller.js";
import authRequired from "../../middleware/authRequired.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check", authRequired, checkAuth);

export default router;
