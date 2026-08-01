import Notification from "../models/Notification";
import User from "../models/User";

// ==========================
// Send notification to admin
// ==========================
export const sendNotificationToAdmin = async (message: string) => {
  try {
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      await Notification.create({
        userId: admin._id,
        title: "New User Registration",
        message: message,
        type: "system",
      });
      console.log("✅ Admin notification sent:", message);
    } else {
      console.log("⚠️ No admin found to send notification");
    }
  } catch (error) {
    console.error("❌ Admin notification error:", error);
  }
};

// ==========================
// Send notification to user
// ==========================
export const sendNotificationToUser = async (userId: string, message: string) => {
  try {
    await Notification.create({
      userId,
      title: "Registration Successful",
      message: message,
      type: "system",
    });
    console.log("✅ User notification sent:", message);
  } catch (error) {
    console.error("❌ User notification error:", error);
  }
};

// ==========================
// Send notification on logout
// ==========================
export const sendLogoutNotification = async (fullName: string, email: string, role: string) => {
  try {
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      await Notification.create({
        userId: admin._id,
        title: "User Logout",
        message: `${fullName} (${email}) has logged out and been removed (${role})`,
        type: "system",
      });
      console.log("✅ Logout notification sent to admin");
    }
  } catch (error) {
    console.error("❌ Logout notification error:", error);
  }
};