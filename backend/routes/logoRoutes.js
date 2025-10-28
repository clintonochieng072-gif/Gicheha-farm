const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { protect, admin } = require("../middleware/auth");
const {
  createLogo,
  updateLogo,
  getLogos,
  getActiveLogo,
  getLogo,
  deleteLogo,
} = require("../controllers/logoController");

// ensure uploads directory exists and use absolute path
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

// Routes - order matters! Specific routes before parameterized ones
router.get("/", getLogos);
router.get("/active", getActiveLogo);
router.get("/:id", getLogo);

// Create logo — accept single image under field name "image", requires admin auth
router.post("/", protect, admin, upload.single("image"), createLogo);

// Update logo — accept single image, requires admin auth
router.put("/:id", protect, admin, upload.single("image"), updateLogo);

router.delete("/:id", protect, admin, deleteLogo);

module.exports = router;
