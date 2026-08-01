import { Router } from "express";
import {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "../controllers/medicalRecord.controller";

import { protect } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

// ==========================
// Create Medical Record
// ==========================
router.post(
  "/",
  protect,
  authorize("doctor", "admin"),
  createMedicalRecord
);

// ==========================
// Get All Medical Records
// ==========================
router.get(
  "/",
  protect,
  authorize("doctor", "admin"),
  getMedicalRecords
);

// ==========================
// Get Single Medical Record
// ==========================
router.get(
  "/:id",
  protect,
  getMedicalRecordById
);

// ==========================
// Update Medical Record
// ==========================
router.put(
  "/:id",
  protect,
  authorize("doctor", "admin"),
  updateMedicalRecord
);

// ==========================
// Delete Medical Record
// ==========================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteMedicalRecord
);

export default router;