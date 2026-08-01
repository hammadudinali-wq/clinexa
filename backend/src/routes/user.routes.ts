import { Router } from "express";

import {
  getProfile,
  getAllUsers,
  getUsersByRole,
  getUserById,
  updateUserStatus,
  deleteUser,
} from "../controllers/user.controller";

import { protect } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

// ==========================
// Current User Profile
// ==========================
router.get(
  "/profile",
  protect,
  getProfile
);

// ==========================
// Admin - Get All Users
// ==========================
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllUsers
);

// ==========================
// Admin - Get Users By Role
// Example: /api/users/role/doctor
// ==========================
router.get(
  "/role/:role",
  protect,
  authorize("admin"),
  getUsersByRole
);

// ==========================
// Admin - Get Single User
// ==========================
router.get(
  "/:id",
  protect,
  authorize("admin"),
  getUserById
);

// ==========================
// Admin - Activate / Deactivate
// ==========================
router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  updateUserStatus
);

// ==========================
// Admin - Delete User
// ==========================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteUser
);

export default router;