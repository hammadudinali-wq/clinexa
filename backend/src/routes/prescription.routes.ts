import { Router } from "express";
import {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescription.controller";

import { protect } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

// ==========================
// Create Prescription
// ==========================
router.post(
  "/",
  protect,
  authorize("doctor", "admin"),
  createPrescription
);

// ==========================
// Get All Prescriptions
// ==========================
router.get(
  "/",
  protect,
  authorize("doctor", "admin"),
  getPrescriptions
);

// ==========================
// Get Single Prescription
// ==========================
router.get(
  "/:id",
  protect,
  getPrescriptionById
);

// ==========================
// Update Prescription
// ==========================
router.put(
  "/:id",
  protect,
  authorize("doctor", "admin"),
  updatePrescription
);

// ==========================
// Delete Prescription
// ==========================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deletePrescription
);

export default router;