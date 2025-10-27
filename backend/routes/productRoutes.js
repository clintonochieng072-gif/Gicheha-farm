const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { protect, admin } = require("../middleware/auth");
const {
  createProduct,
  updateProduct,
  getProducts,
  getProduct,
  deleteProduct,
} = require("../controllers/productController");

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

// Routes
router.get("/", getProducts);
router.get("/:id", getProduct);

// Create product — accept multiple images under field name "images"
router.post("/", protect, admin, upload.array("images", 8), createProduct);

// Update product — accept multiple images
router.put("/:id", protect, admin, upload.array("images", 8), updateProduct);

router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
