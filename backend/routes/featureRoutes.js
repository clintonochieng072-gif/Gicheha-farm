const express = require("express");
const router = express.Router();
const featureController = require("../controllers/featureController");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/", featureController.getFeatures);

// Admin routes (require authentication)
router.get("/admin", protect, featureController.getAllFeatures);
router.get("/:id", protect, featureController.getFeature);
router.post("/", protect, featureController.createFeature);
router.put("/:id", protect, featureController.updateFeature);
router.delete("/:id", protect, featureController.deleteFeature);

module.exports = router;
