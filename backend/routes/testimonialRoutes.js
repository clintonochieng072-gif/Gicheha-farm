const express = require("express");
const multer = require("multer");
const path = require("path");
const { body } = require("express-validator");
const {
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  approveTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Validation rules (optional fields)
const testimonialValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name must be at least 1 character"),
  body("message")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Message must be at least 1 character"),
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
];

// Public routes
router.get("/", getTestimonials);
router.post(
  "/",
  upload.single("image"),
  testimonialValidation,
  createTestimonial
);

// Protected routes (Admin only)
router.get("/admin", protect, admin, getAllTestimonials);
router.put("/:id", protect, admin, upload.single("image"), updateTestimonial);
router.put("/:id/approve", protect, admin, approveTestimonial);
router.delete("/:id", protect, admin, deleteTestimonial);

module.exports = router;
