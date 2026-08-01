import { Router } from "express";
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from "../controllers/payment.controller";

import { protect } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

// ==========================
// Create Payment
// ==========================
router.post(
  "/",
  protect,
  authorize("admin", "patient"),
  createPayment
);

// ==========================
// Get All Payments
// ==========================
router.get(
  "/",
  protect,
  authorize("admin"),
  getPayments
);

// ==========================
// Get Single Payment
// ==========================
router.get(
  "/:id",
  protect,
  getPaymentById
);

// ==========================
// Update Payment
// ==========================
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updatePayment
);

// ==========================
// Delete Payment
// ==========================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deletePayment
);

export default router;