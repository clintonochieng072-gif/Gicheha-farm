const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/", teamController.getAllTeamMembers);
router.get("/:id", teamController.getTeamMemberById);

// Protected routes (require authentication)
router.post(
  "/",
  protect,
  teamController.uploadImage,
  teamController.createTeamMember
);
router.put(
  "/:id",
  protect,
  teamController.uploadImage,
  teamController.updateTeamMember
);
router.delete("/:id", protect, teamController.deleteTeamMember);

module.exports = router;
