import http from "http";
import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server as SocketIOServer } from "socket.io";
import User, { ensureAdmin } from "./models/User";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

// Socket.IO Setup
export const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`🟢 Client connected: ${socket.id}`);

  socket.on("join-room", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined room`);
  });

  socket.on("join-doctor-room", (doctorId) => {
    socket.join(`doctor-${doctorId}`);
    console.log(`👨‍⚕️ Doctor ${doctorId} joined room`);
  });

  socket.on("join-admin-room", () => {
    socket.join("admin-room");
    console.log(`🔑 Admin joined room`);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hospital_db")
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully");

    // ✅ Ensure admin exists
    await ensureAdmin();

    server.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`🔌 Socket.IO is running on ws://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("❌ MongoDB Connection Failed", error);
  });