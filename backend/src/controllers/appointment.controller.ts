import { Request, Response } from "express";
import Appointment, { AppointmentStatus } from "../models/Appointment";
import DoctorAvailability from "../models/DoctorAvailability";
import mongoose from "mongoose";
import { io } from "../server";

// ==========================
// Create Appointment (With Socket.IO)
// ==========================
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.create(req.body);

    await appointment.populate({
      path: "patientId",
      populate: { path: "userId" },
    });
    await appointment.populate("doctorId");

    io.to(`doctor-${appointment.doctorId}`).emit("new-appointment", {
      appointment,
      message: `New appointment booked by ${(appointment.patientId as any).fullName}`,
    });

    io.to("admin-room").emit("new-appointment", {
      appointment,
      message: `New appointment booked for ${(appointment.doctorId as any).name}`,
    });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get All Appointments
// ==========================
export const getAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId")
      .populate("doctorId");

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Single Appointment
// ==========================
export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId")
      .populate("doctorId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update Appointment (With Socket.IO)
// ==========================
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    await appointment.populate({
      path: "patientId",
      populate: { path: "userId" },
    });
    await appointment.populate("doctorId");

    io.to(`doctor-${appointment.doctorId}`).emit("appointment-updated", {
      appointment,
      message: `Appointment updated for ${(appointment.patientId as any).fullName}`,
    });

    io.to(`user-${(appointment.patientId as any).userId}`).emit("appointment-updated", {
      appointment,
      message: `Your appointment has been updated`,
    });

    io.to("admin-room").emit("appointment-updated", {
      appointment,
    });

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Delete Appointment
// ==========================
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Check Doctor Availability
// ==========================
export const checkAvailability = async (req: Request, res: Response) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: "doctorId and date are required",
      });
    }

    const appointmentDate = new Date(date as string);
    const dayOfWeek = appointmentDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const doctorObjectId = new mongoose.Types.ObjectId(doctorId as string);

    const availability = await DoctorAvailability.findOne({
      doctorId: doctorObjectId,
      dayOfWeek,
      isAvailable: true,
    });

    if (!availability) {
      return res.json({
        success: true,
        available: false,
        message: "Doctor not available on this day",
        slots: [],
      });
    }

    const bookings = await Appointment.find({
      doctorId: doctorObjectId,
      appointmentDate: new Date(date as string),
      status: { $ne: AppointmentStatus.CANCELLED },
    });

    const slots = [];
    const start = new Date(`1970-01-01T${availability.startTime}`);
    const end = new Date(`1970-01-01T${availability.endTime}`);

    while (start < end) {
      const time = start.toTimeString().slice(0, 5);
      const isBooked = bookings.some((b) => b.appointmentTime === time);
      slots.push({
        time,
        isBooked,
        available: !isBooked,
      });
      start.setMinutes(start.getMinutes() + availability.slotDuration);
    }

    res.json({
      success: true,
      available: true,
      slots,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Reschedule Appointment
// ==========================
export const rescheduleAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newDate, newTime } = req.body;

    if (!newDate || !newTime) {
      return res.status(400).json({
        success: false,
        message: "newDate and newTime are required",
      });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const conflict = await Appointment.findOne({
      doctorId: appointment.doctorId,
      appointmentDate: new Date(newDate),
      appointmentTime: newTime,
      status: { $ne: AppointmentStatus.CANCELLED },
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Time slot is already booked",
      });
    }

    appointment.appointmentDate = new Date(newDate);
    appointment.appointmentTime = newTime;
    appointment.status = AppointmentStatus.RESCHEDULED;
    await appointment.save();

    res.json({
      success: true,
      message: "Appointment rescheduled successfully",
      data: appointment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Cancel Appointment
// ==========================
export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = AppointmentStatus.CANCELLED;
    appointment.notes = reason || "Cancelled by user";
    await appointment.save();

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
      data: appointment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};