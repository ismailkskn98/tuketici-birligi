const express = require("express");
const authController = require("../controllers/authController");
const { requireAuth } = require("../middlewares/authMiddleware");
const { authLimiter } = require("../middlewares/rateLimiters");

const router = express.Router();

router.post("/login", authLimiter, authController.login);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

module.exports = router;

