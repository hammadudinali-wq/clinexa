import { Request, Response } from "express";
import Patient from "../models/Patient";

// ==========================
// Create Patient
// ==========================
export const createPatient = async (
  req: Request,
  res: Response
) => {
  try {
    const patient = await Patient.create(req.body);

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create patient",
    });
  }
};

// ==========================
// Get All Patients
// ==========================
export const getPatients = async (
  req: Request,
  res: Response
) => {
  try {
    const patients = await Patient.find().populate(
      "userId",
      "-password"
    );

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
    });
  }
};

// ==========================
// Get Patient By ID
// ==========================
export const getPatientById = async (
  req: Request,
  res: Response
) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      "userId",
      "-password"
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient",
    });
  }
};

// ==========================
// Update Patient
// ==========================
export const updatePatient = async (
  req: Request,
  res: Response
) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update patient",
    });
  }
};

// ==========================
// Delete Patient
// ==========================
export const deletePatient = async (
  req: Request,
  res: Response
) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete patient",
    });
  }
};