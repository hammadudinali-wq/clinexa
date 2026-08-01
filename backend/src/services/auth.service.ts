import bcrypt from "bcrypt";
import User, { UserRole } from "../models/User";
import Doctor from "../models/Doctor";
import Patient from "../models/Patient";
import Notification, {
  NotificationType,
} from "../models/Notification";

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role?: UserRole;
}

// ==========================
// Register User
// ==========================
export const registerUser = async (data: RegisterData) => {
  const {
    fullName,
    email,
    password,
    phone,
    role = UserRole.PATIENT,
  } = data;

  // Check Existing User
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create User
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    phone,
    role,
  });

  // ==========================
  // Auto Create Doctor Profile
  // ==========================
  if (role === UserRole.DOCTOR) {
    await Doctor.create({
      userId: user._id,
    });
  }

  // ==========================
  // Auto Create Patient Profile
  // ==========================
  if (role === UserRole.PATIENT) {
    await Patient.create({
      userId: user._id,
    });
  }

  // ==========================
  // Notification For User
  // ==========================
  await Notification.create({
    userId: user._id,
    title: "Registration Successful",
    message: `You are registered successfully as ${role}.`,
    type: NotificationType.GENERAL,
  });

  // ==========================
  // Notification For Admin
  // ==========================
  const admin = await User.findOne({
    role: UserRole.ADMIN,
  });

  if (admin) {
    await Notification.create({
      userId: admin._id,
      title: "New Registration",
      message: `${fullName} registered as ${role}.`,
      type: NotificationType.GENERAL,
    });
  }

  return user;
};

// ==========================
// Login
// ==========================
export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("Your account is disabled.");
  }

  const matched = await bcrypt.compare(
    password,
    user.password
  );

  if (!matched) {
    throw new Error("Invalid email or password");
  }

  return user;
};