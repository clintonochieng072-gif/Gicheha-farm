const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const {
  createCategory,
  updateCategory,
  getCategories,
  getCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// Routes
router.get("/", getCategories);
router.get("/:id", getCategory);

// Create category — requires admin auth
router.post("/", protect, admin, createCategory);

// Update category — requires admin auth
router.put("/:id", protect, admin, updateCategory);

router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
