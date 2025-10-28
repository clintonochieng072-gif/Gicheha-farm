const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const {
  createSocialMedia,
  updateSocialMedia,
  getSocialMedias,
  getSocialMedia,
  deleteSocialMedia,
} = require("../controllers/socialMediaController");

// Routes
router.get("/", getSocialMedias);
router.get("/:id", getSocialMedia);

// Create social media — requires admin auth
router.post("/", protect, admin, createSocialMedia);

// Update social media — requires admin auth
router.put("/:id", protect, admin, updateSocialMedia);

router.delete("/:id", protect, admin, deleteSocialMedia);

module.exports = router;
