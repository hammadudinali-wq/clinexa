import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

// Routes
import authRoutes from "./routes/auth.routes";
import doctorRoutes from "./routes/doctor.routes";
import patientRoutes from "./routes/patient.routes";
import appointmentRoutes from "./routes/appointment.routes";
import prescriptionRoutes from "./routes/prescription.routes";
import medicalRecordRoutes from "./routes/medicalRecord.routes";
import paymentRoutes from "./routes/payment.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import uploadRoutes from "./routes/upload.routes";
import notificationRoutes from "./routes/notification.routes";

dotenv.config();

const app = express();

// ==========================
// Middlewares
// ==========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// Static Upload Folder
// ==========================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================
// Swagger API Documentation
// ==========================
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

// ==========================
// Routes
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/notifications", notificationRoutes);

// ==========================
// Health Check
// ==========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Clinexa Backend API is Running 🚀",
  });
});

export default app;