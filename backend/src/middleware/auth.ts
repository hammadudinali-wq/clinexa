import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get Authorization Header
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Extract Token
    const token = authHeader.replace("Bearer ", "").trim();

    console.log("TOKEN:", token);

    // JWT Secret
    const secret = process.env.JWT_SECRET;

    console.log("VERIFY SECRET:", secret);

    if (!secret) {
      throw new Error("JWT_SECRET is missing");
    }

    // Verify Token
    const decoded = jwt.verify(token, secret) as {
      id: string;
    };

    console.log("DECODED:", decoded);

    // Find User
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error: any) {
    console.log("JWT ERROR NAME:", error.name);
    console.log("JWT ERROR MESSAGE:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid token",
      debug: error.message,
    });
  }
};