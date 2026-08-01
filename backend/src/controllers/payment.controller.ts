import { Request, Response } from "express";
import Payment from "../models/Payment";

// ==========================
// Create Payment
// ==========================
export const createPayment = async (
  req: Request,
  res: Response
) => {
  try {
    const payment = await Payment.create(req.body);

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get All Payments
// ==========================
export const getPayments = async (
  req: Request,
  res: Response
) => {
  try {
    const payments = await Payment.find()
      .populate("patientId")
      .populate("appointmentId");

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Payment By ID
// ==========================
export const getPaymentById = async (
  req: Request,
  res: Response
) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("patientId")
      .populate("appointmentId");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update Payment
// ==========================
export const updatePayment = async (
  req: Request,
  res: Response
) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: payment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Delete Payment
// ==========================
export const deletePayment = async (
  req: Request,
  res: Response
) => {
  try {
    const payment = await Payment.findByIdAndDelete(
      req.params.id
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};