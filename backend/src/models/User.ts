import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export enum UserRole {
  ADMIN = "admin",
  DOCTOR = "doctor",
  PATIENT = "patient",
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  profileImage: string;
  isVerified: boolean;
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpiry?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.PATIENT },
    profileImage: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    resetPasswordToken: { type: String, default: undefined },
    resetPasswordExpiry: { type: Number, default: undefined },
  },
  { timestamps: true }
);

export const ensureAdmin = async () => {
  try {
    const UserModel = mongoose.model<IUser>("User");
    const adminExists = await UserModel.findOne({ role: UserRole.ADMIN });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      await UserModel.create({
        fullName: "Super Admin",
        email: "admin@hospital.com",
        password: hashedPassword,
        phone: "03001234567",
        role: UserRole.ADMIN,
      });
      console.log("✅ Admin created successfully");
    } else {
      console.log("✅ Admin already exists");
    }
  } catch (error) {
    console.error("❌ Admin creation error:", error);
  }
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;