import { Request, Response } from "express";
import User from "../models/User";
import Doctor from "../models/Doctor";
import Patient from "../models/Patient";
import Appointment from "../models/Appointment";
import Payment from "../models/Payment";
import Prescription from "../models/Prescription";
import MedicalRecord from "../models/MedicalRecord";

// ==========================
// Get Dashboard Stats (Updated - Role Based)
// ==========================
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const user = await User.findById(userId);

    let appointmentFilter = {};
    let patientFilter = {};
    let prescriptionFilter = {};
    let paymentFilter = {};

    // ✅ Agar doctor hai toh sirf uski appointments, patients, prescriptions dikhao
    if (user?.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: user._id });
      if (doctor) {
        appointmentFilter = { doctorId: doctor._id };
        patientFilter = { doctorId: doctor._id };
        prescriptionFilter = { doctorId: doctor._id };
        paymentFilter = { doctorId: doctor._id };
      } else {
        // Agar doctor profile nahi hai toh sab 0 dikhao
        return res.json({
          success: true,
          data: {
            totalUsers: 0,
            totalDoctors: 0,
            totalPatients: 0,
            totalAppointments: 0,
            totalPrescriptions: 0,
            totalMedicalRecords: 0,
            totalPayments: 0,
            totalRevenue: 0,
          },
        });
      }
    } 
    // ✅ Agar patient hai toh sirf uski appointments, prescriptions dikhao
    else if (user?.role === "patient") {
      const patient = await Patient.findOne({ userId: user._id });
      if (patient) {
        appointmentFilter = { patientId: patient._id };
        prescriptionFilter = { patientId: patient._id };
        paymentFilter = { patientId: patient._id };
      }
    }

    const [
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalPrescriptions,
      totalMedicalRecords,
      totalPayments,
      totalRevenue,
    ] = await Promise.all([
      User.countDocuments(),
      Doctor.countDocuments(),
      Patient.countDocuments(patientFilter),
      Appointment.countDocuments(appointmentFilter),
      Prescription.countDocuments(prescriptionFilter),
      MedicalRecord.countDocuments(),
      Payment.countDocuments(paymentFilter),
      Payment.aggregate([
        { $match: { ...paymentFilter, status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDoctors,
        totalPatients,
        totalAppointments,
        totalPrescriptions,
        totalMedicalRecords,
        totalPayments,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// ✅ Get Admin Dashboard Analytics
// ==========================
export const getAdminAnalytics = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalPayments,
      totalRevenue,
      totalPrescriptions,
      totalMedicalRecords,
    ] = await Promise.all([
      User.countDocuments(),
      Doctor.countDocuments(),
      Patient.countDocuments(),
      Appointment.countDocuments(),
      Payment.countDocuments(),
      Payment.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Prescription.countDocuments(),
      MedicalRecord.countDocuments(),
    ]);

    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    const topDoctors = await Appointment.aggregate([
      { $group: { _id: "$doctorId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $unwind: "$doctor" },
      {
        $project: {
          name: "$doctor.name",
          specialization: "$doctor.specialization",
          appointmentCount: "$count",
        },
      },
    ]);

    const topPatients = await Appointment.aggregate([
      { $group: { _id: "$patientId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "patients",
          localField: "_id",
          foreignField: "_id",
          as: "patient",
        },
      },
      { $unwind: "$patient" },
      {
        $project: {
          name: "$patient.fullName",
          appointmentCount: "$count",
        },
      },
    ]);

    const appointmentStatus = await Appointment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const recentActivities = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("patientId")
      .populate("doctorId")
      .select("patientId doctorId appointmentDate status createdAt");

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalDoctors,
          totalPatients,
          totalAppointments,
          totalPayments,
          totalRevenue: totalRevenue[0]?.total || 0,
          totalPrescriptions,
          totalMedicalRecords,
        },
        monthlyRevenue,
        topDoctors,
        topPatients,
        appointmentStatus,
        recentActivities,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// ✅ Get Monthly Revenue
// ==========================
export const getMonthlyRevenue = async (req: Request, res: Response) => {
  try {
    const revenue = await Payment.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      data: revenue,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// ✅ Get Appointment Statistics
// ==========================
export const getAppointmentStats = async (req: Request, res: Response) => {
  try {
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Appointment.countDocuments();

    res.json({
      success: true,
      data: {
        total,
        stats,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// ✅ Get Revenue Overview
// ==========================
export const getRevenueOverview = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const [todayRevenue, weekRevenue, monthRevenue, totalRevenue] =
      await Promise.all([
        Payment.aggregate([
          {
            $match: {
              status: "paid",
              createdAt: {
                $gte: new Date(today.setHours(0, 0, 0, 0)),
                $lte: new Date(today.setHours(23, 59, 59, 999)),
              },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Payment.aggregate([
          {
            $match: {
              status: "paid",
              createdAt: { $gte: startOfWeek },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Payment.aggregate([
          {
            $match: {
              status: "paid",
              createdAt: { $gte: startOfMonth },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Payment.aggregate([
          { $match: { status: "paid" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
      ]);

    res.json({
      success: true,
      data: {
        today: todayRevenue[0]?.total || 0,
        week: weekRevenue[0]?.total || 0,
        month: monthRevenue[0]?.total || 0,
        total: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};