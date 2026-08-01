import Notification from "../models/Notification";
import User from "../models/User";

export const sendNotificationToAdmin = async (message: string) => {
  try {
    const admin = await User.findOne({ role: "admin" as any });
    if (admin) {
      await Notification.create({
        userId: admin._id.toString(),
        title: "New User Registration",
        message,
        type: "notification" as any, // ✅ Fix: type as any
      });
      console.log("✅ Admin notification sent:", message);
    }
  } catch (error) {
    console.error("❌ Admin notification error:", error);
  }
};

export const sendNotificationToUser = async (userId: string, message: string) => {
  try {
    await Notification.create({
      userId,
      title: "Registration Successful",
      message,
      type: "notification" as any, // ✅ Fix: type as any
    });
    console.log("✅ User notification sent:", message);
  } catch (error) {
    console.error("❌ User notification error:", error);
  }
};

export const sendLogoutNotification = async (fullName: string, email: string, role: string) => {
  try {
    const admin = await User.findOne({ role: "admin" as any });
    if (admin) {
      await Notification.create({
        userId: admin._id.toString(),
        title: "User Logout",
        message: `${fullName} (${email}) has logged out and been removed (${role})`,
        type: "notification" as any, // ✅ Fix: type as any
      });
      console.log("✅ Logout notification sent to admin");
    }
  } catch (error) {
    console.error("❌ Logout notification error:", error);
  }
};