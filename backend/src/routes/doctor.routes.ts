import { Router } from "express";
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,  // ✅ Ab yeh import ho jayega
  deleteDoctor,
} from "../controllers/doctor.controller";

import { protect } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

// Add Doctor
router.post(
  "/",
  protect,
  authorize("admin"),
  createDoctor
);

// Get All Doctors
router.get(
  "/",
  protect,
  getDoctors
);

// Get Single Doctor
router.get(
  "/:id",
  protect,
  getDoctorById
);

// ✅ Update Doctor (PUT)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateDoctor
);

// Delete Doctor
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteDoctor
);

export default router;