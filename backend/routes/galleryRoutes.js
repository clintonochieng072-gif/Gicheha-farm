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

const upload = multer({ storage });

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
