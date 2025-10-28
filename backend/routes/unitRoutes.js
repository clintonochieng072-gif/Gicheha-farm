const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const {
  createUnit,
  updateUnit,
  getUnits,
  getUnit,
  deleteUnit,
} = require("../controllers/unitController");

// Routes
router.get("/", getUnits);
router.get("/:id", getUnit);

// Create unit — requires admin auth
router.post("/", protect, admin, createUnit);

// Update unit — requires admin auth
router.put("/:id", protect, admin, updateUnit);

router.delete("/:id", protect, admin, deleteUnit);

module.exports = router;
