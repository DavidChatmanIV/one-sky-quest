const express = require("express");
const router = express.Router();
const { planTrip } = require("../controllers/tripcontroller");

// Public route — no authMiddleware
router.post("/plan-trip", planTrip);

module.exports = router;
