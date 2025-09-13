import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { registerSchema, loginSchema } from "../validationSchemas.js";

const router = express.Router();

// Health check for this router
router.get('/ping', (req, res) => res.json({ ok: true }));

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get logged-in user profile
router.get("/me", protect, getMe);

export default router;
