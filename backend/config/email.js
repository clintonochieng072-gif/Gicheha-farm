const nodemailer = require("nodemailer");

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App-specific password for Gmail
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log("Email transporter error:", error.message);
  } else {
    console.log("Email server is ready to send messages");
  }
});

module.exports = transporter;
