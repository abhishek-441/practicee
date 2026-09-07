import express from "express";
import rateLimit from "express-rate-limit";
import { register, login, refresh, logout, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";

const router = express.Router();

// Limit brute-force login/register attempts per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later" }
});

router.post("/register", authLimiter, validateBody(registerSchema), register);
router.post("/login", authLimiter, validateBody(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
