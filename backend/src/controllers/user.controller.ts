import { Request, Response } from "express";
import User from "../models/User";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = getUsers;

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsersByRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    const validRoles = ["admin", "doctor", "patient"];
    if (!validRoles.includes(role as string)) {
      return res.status(400).json({ success: false, message: "Invalid user role" });
    }
    // ✅ FINAL FIX: Using any to bypass TypeScript error
    const users = await User.find({ role: role as any }).select("-password");
    res.json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    const { userId } = req.body;
    const validRoles = ["admin", "doctor", "patient"];
    if (!validRoles.includes(role as string)) {
      return res.status(400).json({ success: false, message: "Invalid user role" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { role: role as any },
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User role updated successfully", data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User status updated successfully", data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { fullName, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { fullName, phone },
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "Profile updated successfully", data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};