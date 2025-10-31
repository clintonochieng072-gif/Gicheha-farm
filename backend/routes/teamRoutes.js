const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const teamController = require("../controllers/teamController");
const { protect } = require("../middleware/auth");

// Multer config for temporary storage
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
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

// Public routes
router.get("/", teamController.getAllTeamMembers);
router.get("/admin", protect, teamController.getAllTeamMembersAdmin); // New admin route
router.get("/:id", teamController.getTeamMemberById);

// Protected routes (require authentication)
router.post(
  "/",
  protect,
  upload.single("image"),
  teamController.createTeamMember
);
router.put(
  "/:id",
  protect,
  upload.single("image"),
  teamController.updateTeamMember
);
router.delete("/:id", protect, teamController.deleteTeamMember);

module.exports = router;
