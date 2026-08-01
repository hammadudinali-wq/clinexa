import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Doctor from "../models/Doctor";
import User, { UserRole } from "../models/User";

// ==========================
// Create Doctor
// ==========================
export const createDoctor = async (req: Request, res: Response) => {
  let createdUserId: string | null = null;

  try {
    const {
      fullName,
      email,
      password,
      phone,
      specialization,
      qualification,
      experience,
      department,
      available = true,
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !password ||
      !phone ||
      !specialization ||
      !qualification ||
      experience === undefined ||
      !department
    ) {
      return res.status(400).json({
        success: false,
        message: "All doctor fields are required",
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User account
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role: UserRole.DOCTOR,
      isVerified: true,
      isActive: true,
    });

    createdUserId = user._id.toString();

    try {
      // Create Doctor profile
      const doctor = await Doctor.create({
        userId: user._id,
        specialization,
        qualification,
        experience: Number(experience),
        phone,
        department,
        available,
      });

      return res.status(201).json({
        success: true,
        message: "Doctor added successfully",
        data: {
          doctor,
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
        },
      });
    } catch (doctorError) {
      // If doctor profile fails, remove created User
      await User.findByIdAndDelete(createdUserId);

      throw doctorError;
    }
  } catch (error: any) {
    console.error("Create doctor error:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create doctor",
    });
  }
};

// ==========================
// Get All Doctors
// ==========================
export const getDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await Doctor.find()
      .populate("userId", "-password -resetPasswordToken -resetPasswordExpiry")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch doctors",
    });
  }
};

// ==========================
// Get Single Doctor
// ==========================
export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "userId",
      "-password -resetPasswordToken -resetPasswordExpiry"
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch doctor",
    });
  }
};

// ==========================
// Update Doctor
// ==========================
export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      specialization,
      qualification,
      experience,
      department,
      available,
    } = req.body;

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Update Doctor profile fields
    if (specialization !== undefined)
      doctor.specialization = specialization;

    if (qualification !== undefined)
      doctor.qualification = qualification;

    if (experience !== undefined)
      doctor.experience = Number(experience);

    if (phone !== undefined) {
      doctor.phone = phone;
    }

    if (department !== undefined)
      doctor.department = department;

    if (available !== undefined)
      doctor.available = available;

    await doctor.save();

    // Update linked User
    const user = await User.findById(doctor.userId);

    if (user) {
      if (fullName !== undefined)
        user.fullName = fullName;

      if (email !== undefined)
        user.email = email.toLowerCase();

      if (phone !== undefined)
        user.phone = phone;

      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      await user.save();
    }

    const updatedDoctor = await Doctor.findById(doctor._id).populate(
      "userId",
      "-password -resetPasswordToken -resetPasswordExpiry"
    );

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update doctor",
    });
  }
};

// ==========================
// Delete Doctor
// ==========================
export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Delete linked User as well
    await User.findByIdAndDelete(doctor.userId);

    // Delete Doctor profile
    await Doctor.findByIdAndDelete(doctor._id);

    res.status(200).json({
      success: true,
      message: "Doctor and user account deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete doctor",
    });
  }
};