import { Router } from "express";
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patient.controller";

import { protect } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

// Create Patient
router.post("/", protect, authorize("admin"), createPatient);

// Get All Patients
router.get("/", protect, getPatients);

// Get Single Patient
router.get("/:id", protect, getPatientById);

// Update Patient
router.put("/:id", protect, authorize("admin"), updatePatient);

// Delete Patient
router.delete("/:id", protect, authorize("admin"), deletePatient);

export default router;