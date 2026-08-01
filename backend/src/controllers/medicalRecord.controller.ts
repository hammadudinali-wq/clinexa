import { Request, Response } from "express";
import MedicalRecord from "../models/MedicalRecord";

// ==========================
// Create Medical Record
// ==========================
export const createMedicalRecord = async (
  req: Request,
  res: Response
) => {
  try {
    const medicalRecord = await MedicalRecord.create(req.body);

    res.status(201).json({
      success: true,
      message: "Medical Record created successfully",
      data: medicalRecord,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get All Medical Records
// ==========================
export const getMedicalRecords = async (
  req: Request,
  res: Response
) => {
  try {
    const medicalRecords = await MedicalRecord.find()
      .populate("patientId")
      .populate("doctorId")
      .populate("appointmentId");

    res.status(200).json({
      success: true,
      count: medicalRecords.length,
      data: medicalRecords,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Single Medical Record
// ==========================
export const getMedicalRecordById = async (
  req: Request,
  res: Response
) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id)
      .populate("patientId")
      .populate("doctorId")
      .populate("appointmentId");

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical Record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: medicalRecord,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update Medical Record
// ==========================
export const updateMedicalRecord = async (
  req: Request,
  res: Response
) => {
  try {
    const medicalRecord = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical Record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medical Record updated successfully",
      data: medicalRecord,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Delete Medical Record
// ==========================
export const deleteMedicalRecord = async (
  req: Request,
  res: Response
) => {
  try {
    const medicalRecord = await MedicalRecord.findByIdAndDelete(
      req.params.id
    );

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical Record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medical Record deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};