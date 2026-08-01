import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth";

const router = Router();

// ==========================
// Public Routes
// ==========================
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ==========================
// Protected Routes
// ==========================
router.put("/change-password", protect, changePassword);
router.post("/logout", protect, logout); // ✅ Logout route

export default router;