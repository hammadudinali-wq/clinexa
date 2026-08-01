import { Router } from "express";
import upload from "../middleware/upload";
import { uploadFile } from "../controllers/upload.controller";

const router = Router();

// ==========================
// Upload Single File
// ==========================
router.post(
  "/",
  upload.single("file"),
  uploadFile
);

export default router;