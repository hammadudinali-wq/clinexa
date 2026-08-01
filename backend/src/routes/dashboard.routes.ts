import { Router } from "express";
import {
  getAdminAnalytics,
  getMonthlyRevenue,
  getAppointmentStats,
  getDashboardStats,        // ✅ Add this import
  getRevenueOverview,       // ✅ Add this import (if you want)
} from "../controllers/dashboard.controller";
import { protect } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

// ✅ Admin Analytics
router.get(
  "/analytics",
  protect,
  authorize("admin"),
  getAdminAnalytics
);

// ✅ Monthly Revenue
router.get(
  "/revenue",
  protect,
  authorize("admin"),
  getMonthlyRevenue
);

// ✅ Appointment Statistics
router.get(
  "/appointment-stats",
  protect,
  authorize("admin", "doctor"),
  getAppointmentStats
);

// ✅ Revenue Overview (Optional)
router.get(
  "/revenue-overview",
  protect,
  authorize("admin"),
  getRevenueOverview
);

// ✅ Dashboard Stats (Existing)
router.get(
  "/stats",
  protect,
  getDashboardStats
);

export default router;