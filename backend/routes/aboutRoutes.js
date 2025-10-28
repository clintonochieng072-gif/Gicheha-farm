const express = require("express");
const router = express.Router();
const aboutController = require("../controllers/aboutController");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/", aboutController.getAbouts);

// Admin routes (require authentication)
router.get("/admin", protect, aboutController.getAllAbouts);
router.get("/:id", protect, aboutController.getAbout);
router.post("/", protect, aboutController.createAbout);
router.put("/:id", protect, aboutController.updateAbout);
router.delete("/:id", protect, aboutController.deleteAbout);

module.exports = router;
