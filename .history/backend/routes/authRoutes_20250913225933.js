
import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { registerSchema, loginSchema } from "../validationSchemas.js";

const router = express.Router();

// Register new user
router.post("/register", validateRequest(registerSchema), registerUser);

// Login user
router.post("/login", validateRequest(loginSchema), loginUser);

// Get logged-in user profile
router.get("/me", protect, getMe);

export default router;
