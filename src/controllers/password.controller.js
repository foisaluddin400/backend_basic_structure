import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import codeGenerator from "../utils/codeGenerator.js";
import sendForgotPasswordEmail from "../utils/sendForgotPasswordEmail.js";

// ================= STEP 1: FORGOT PASSWORD =================
// POST /auth/forgot-password
// body: { email }
// → OTP generate করে email পাঠাবে
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Account not verified. Please verify your email first.",
      });
    }
    const { code, expiredAt } = codeGenerator(10);

    user.otp = code;
    user.otpExpires = expiredAt;
    await user.save();

    // Email পাঠাও
    await sendForgotPasswordEmail(email, user.name, code);

    res.status(200).json({
      message: `A password reset code has been sent to ${email}. Please check your inbox.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= STEP 2: VERIFY FORGOT PASSWORD OTP =================
// POST /auth/verify-reset-otp
// body: { email, otp }
// → OTP সঠিক হলে একটি resetToken দেবে যেটা দিয়ে new password set করা যাবে
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // OTP মিলছে কিনা চেক
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    // OTP মেয়াদ শেষ কিনা চেক
    if (Date.now() > user.otpExpires) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new code.",
      });
    }

    // OTP সঠিক — এখন OTP মুছে দাও এবং resetVerified flag রাখো
    // আমরা একটি short-lived resetToken বানাচ্ছি (userId base64 encoded)
    // যাতে user পরের step এ password set করতে পারে
    const resetToken = Buffer.from(`${user._id}:${Date.now()}`).toString("base64");

    user.otp = undefined;
    user.otpExpires = undefined;
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 মিনিট
    await user.save();

    res.status(200).json({
      message: "OTP verified successfully. Now set your new password.",
      resetToken, // frontend এ এই token রেখে next step এ পাঠাবে
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= STEP 3: SET NEW PASSWORD =================
// POST /auth/set-new-password
// body: { resetToken, newPassword, confirmPassword }
// → নতুন password সেট করবে
export const setNewPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // resetToken দিয়ে user খোঁজো
    const user = await User.findOne({
      resetToken,
      resetTokenExpires: { $gt: Date.now() }, // এখনো valid কিনা
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token. Please start over.",
      });
    }

    // নতুন password সেট করো (pre-save hook hash করবে)
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "Password has been reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CHANGE PASSWORD (Logged-in user) =================
// POST /auth/change-password
// header: Bearer token (protect middleware লাগবে)
// body: { currentPassword, newPassword, confirmPassword }
// → logged-in user তার নিজের password পরিবর্তন করবে
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    // req.user আসবে protect middleware থেকে
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Current password সঠিক কিনা চেক
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // নতুন password সেট করো
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};