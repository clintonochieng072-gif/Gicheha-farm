const express = require("express");
const multer = require("multer");
const path = require("path");
const { body } = require("express-validator");
const {
  getGallery,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} = require("../controllers/galleryController");
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

// File filter to allow images and videos
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
});

// Validation rules (optional fields)
const galleryValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title must be at least 1 character"),
];

// Public routes
router.get("/", getGallery);

// Protected routes (Admin only)
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  galleryValidation,
  createGalleryImage
);
router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  galleryValidation,
  updateGalleryImage
);
router.delete("/:id", protect, admin, deleteGalleryImage);

module.exports = router;
