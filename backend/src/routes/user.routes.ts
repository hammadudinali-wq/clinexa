import { Router } from "express";
import {
  getProfile,
  getAllUsers,
  getUsersByRole,
  getUserById,
  updateUserRole,
  updateUserStatus,
  updateProfile,
  deleteUser,
} from "../controllers/user.controller";
import { protect } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

router.get("/profile", protect, getProfile);
router.get("/", protect, authorize("admin"), getAllUsers);
router.get("/role/:role", protect, authorize("admin"), getUsersByRole);
router.get("/:id", protect, authorize("admin"), getUserById);
router.put("/role/:role", protect, authorize("admin"), updateUserRole);
router.put("/status/:userId", protect, authorize("admin"), updateUserStatus);
router.put("/profile", protect, updateProfile);
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;