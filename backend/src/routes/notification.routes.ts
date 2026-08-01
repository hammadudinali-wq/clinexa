import { Router } from "express";
import {
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
  deleteNotification,
} from "../controllers/notification.controller";
import { protect } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

// ==========================
// Create Notification
// ==========================
router.post("/", protect, createNotification);

// ==========================
// Get All Notifications
// ==========================
router.get("/", protect, getNotifications);

// ==========================
// Get Notification By ID
// ==========================
router.get("/:id", protect, getNotificationById);

// ==========================
// Mark Notification As Read
// ==========================
router.put("/:id/read", protect, markAsRead);

// ==========================
// Delete Notification
// ==========================
router.delete("/:id", protect, authorize("admin"), deleteNotification);

export default router;