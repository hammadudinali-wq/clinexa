import { Request, Response } from "express";
import Prescription from "../models/Prescription";

// ==========================
// Create Prescription
// ==========================
export const createPrescription = async (
  req: Request,
  res: Response
) => {
  try {
    const prescription = await Prescription.create(req.body);

    res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      data: prescription,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get All Prescriptions
// ==========================
export const getPrescriptions = async (
  req: Request,
  res: Response
) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("appointmentId")
      .populate("doctorId")
      .populate("patientId");

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Single Prescription
// ==========================
export const getPrescriptionById = async (
  req: Request,
  res: Response
) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("appointmentId")
      .populate("doctorId")
      .populate("patientId");

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update Prescription
// ==========================
export const updatePrescription = async (
  req: Request,
  res: Response
) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Prescription updated successfully",
      data: prescription,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Delete Prescription
// ==========================
export const deletePrescription = async (
  req: Request,
  res: Response
) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(
      req.params.id
    );

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Prescription deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};