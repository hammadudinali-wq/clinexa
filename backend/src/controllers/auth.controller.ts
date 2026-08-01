import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { generateToken } from "../utils/generateToken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { sendEmail } from "../utils/email";
import { sendNotificationToAdmin, sendNotificationToUser, sendLogoutNotification } from "../utils/notification";

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, phone, role } = req.body;
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }
    const user = await registerUser({ fullName, email, password, phone, role });
    const token = generateToken(user._id.toString());

    await sendNotificationToAdmin(`${fullName} (${email}) registered as a ${role || "patient"}`);
    await sendNotificationToUser(user._id.toString(), `You are registered as a ${role || "patient"}`);

    res.status(201).json({ success: true, message: "User registered successfully", token, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    const user = await loginUser(email, password);
    const token = generateToken(user._id.toString());
    res.status(200).json({ success: true, message: "Login successful", token, data: user });
  } catch (error) {
    res.status(401).json({ success: false, message: error instanceof Error ? error.message : "Login failed" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found with this email" });
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = Date.now() + 3600000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail(user.email, "Password Reset Request", `<h2>Password Reset</h2><p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a><p>This link expires in 1 hour.</p>`);
    res.json({ success: true, message: "Password reset email sent successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "Token and new password are required" });
    }
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired token" });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current password and new password are required" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Current password is incorrect" });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ success: true, message: "Password changed successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const { fullName, email, role } = user;
    await User.findByIdAndDelete(userId);
    await sendLogoutNotification(fullName, email, role);
    res.json({ success: true, message: "User logged out and removed successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};