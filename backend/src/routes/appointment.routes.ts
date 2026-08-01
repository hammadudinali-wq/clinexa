import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  checkAvailability,
  rescheduleAppointment,
  cancelAppointment,
} from "../controllers/appointment.controller";

import { protect } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

// ==========================
// Create Appointment
// ==========================
router.post(
  "/",
  protect,
  authorize("patient", "admin"),
  createAppointment
);

// ==========================
// Get All Appointments
// ==========================
router.get(
  "/",
  protect,
  authorize("admin", "doctor"),
  getAppointments
);

// ==========================
// Get Single Appointment
// ==========================
router.get(
  "/:id",
  protect,
  getAppointmentById
);

// ==========================
// Update Appointment
// ==========================
router.put(
  "/:id",
  protect,
  authorize("admin", "doctor"),
  updateAppointment
);

// ==========================
// Delete Appointment
// ==========================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteAppointment
);

// ==========================
// ✅ Phase 5: Check Availability
// ==========================
router.get(
  "/check-availability",
  protect,
  authorize("admin", "doctor", "patient"),
  checkAvailability
);

// ==========================
// ✅ Phase 5: Reschedule Appointment
// ==========================
router.put(
  "/:id/reschedule",
  protect,
  authorize("admin", "doctor", "patient"),
  rescheduleAppointment
);

// ==========================
// ✅ Phase 5: Cancel Appointment
// ==========================
router.put(
  "/:id/cancel",
  protect,
  authorize("admin", "doctor", "patient"),
  cancelAppointment
);

export default router;