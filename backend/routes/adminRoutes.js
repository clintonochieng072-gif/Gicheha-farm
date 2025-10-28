const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Admin = require("../models/Admin");

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

module.exports = router;
