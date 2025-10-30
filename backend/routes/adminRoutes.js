const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const Admin = require("../models/Admin");
const transporter = require("../config/email");

const router = express.Router();

// Generate tokens
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

// Admin login route
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Find admin by email
      const admin = await Admin.findOne({ email: email.toLowerCase() });

      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isPasswordValid = await admin.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate tokens
      const payload = { admin: true, email: admin.email, id: admin._id };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      // Store refresh token in database using atomic operation
      await Admin.findOneAndUpdate(
        { _id: admin._id },
        { $set: { refreshToken: refreshToken } },
        { new: true, runValidators: true }
      );

      // Set refresh token as HttpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        accessToken,
        message: "Login successful",
        admin: {
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Refresh token route
router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find admin and verify refresh token matches
    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new tokens
    const payload = { admin: true, email: admin.email, id: admin._id };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // Update refresh token in database using atomic operation
    await Admin.findOneAndUpdate(
      { _id: decoded.id, refreshToken: refreshToken },
      { $set: { refreshToken: newRefreshToken } },
      { new: true, runValidators: true }
    );

    // Set new refresh token as HttpOnly cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      accessToken: newAccessToken,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

// Logout route
router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      // Find admin and clear refresh token using atomic operation
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      await Admin.findOneAndUpdate(
        { _id: decoded.id, refreshToken: refreshToken },
        { $set: { refreshToken: null } },
        { new: true, runValidators: true }
      );
    } catch (error) {
      // Ignore errors during logout
    }
  }

  // Clear refresh token cookie
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

// Verify admin token route
router.get("/verify", (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, admin: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Forgot password route
router.post(
  "/forgot-password",
  [body("email").isEmail().normalizeEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email } = req.body;

      const admin = await Admin.findOne({ email: email.toLowerCase() });
      if (!admin) {
        // Don't reveal if email exists or not for security
        return res.json({
          message:
            "If an account with that email exists, a password reset link has been sent.",
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour

      // Save reset token to admin
      admin.resetPasswordToken = resetToken;
      admin.resetPasswordExpires = resetTokenExpiry;
      await admin.save();

      // Send reset email
      const resetUrl = `${
        process.env.FRONTEND_URL || "https://gicheha-farm-1.onrender.com"
      }/admin/reset-password/${resetToken}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: admin.email,
        subject: "Gicheha Farm - Password Reset",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0ea5e9;">Password Reset Request</h2>
            <p>You requested a password reset for your Gicheha Farm admin account.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="background-color: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this reset, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">Gicheha Farm Rongai</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Reset password route
router.post(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { token } = req.params;
      const { password } = req.body;

      const admin = await Admin.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!admin) {
        return res
          .status(400)
          .json({ message: "Invalid or expired reset token" });
      }

      // Update password
      admin.password = password;
      admin.resetPasswordToken = null;
      admin.resetPasswordExpires = null;
      await admin.save();

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update admin credentials route (change password/email)
router.put(
  "/credentials",
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newEmail").optional().isEmail().normalizeEmail(),
    body("newPassword")
      .optional()
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded.id);

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const { currentPassword, newEmail, newPassword } = req.body;

      // Verify current password
      const isCurrentPasswordValid = await admin.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Update email if provided
      if (newEmail && newEmail !== admin.email) {
        const existingAdmin = await Admin.findOne({
          email: newEmail.toLowerCase(),
        });
        if (existingAdmin) {
          return res.status(400).json({ message: "Email already in use" });
        }
        admin.email = newEmail;
      }

      // Update password if provided
      if (newPassword) {
        admin.password = newPassword;
      }

      await admin.save();

      res.json({
        message: "Credentials updated successfully",
        admin: {
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (error) {
      console.error("Update credentials error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
