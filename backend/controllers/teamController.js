const Team = require("../models/Team");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/team");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "team-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Get all team members
exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await Team.find({ isActive: true }).sort({ order: 1 });
    res.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get team member by ID
exports.getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }
    res.json(teamMember);
  } catch (error) {
    console.error("Error fetching team member:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new team member
exports.createTeamMember = async (req, res) => {
  try {
    const { name, position, bio, initials, order } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = `/uploads/team/${req.file.filename}`;

    const teamMember = new Team({
      name,
      position,
      bio,
      image: imageUrl,
      initials,
      order: order || 0,
    });

    await teamMember.save();
    res.status(201).json(teamMember);
  } catch (error) {
    console.error("Error creating team member:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update team member
exports.updateTeamMember = async (req, res) => {
  try {
    const { name, position, bio, initials, order, isActive } = req.body;
    const teamMember = await Team.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    // Update fields
    teamMember.name = name || teamMember.name;
    teamMember.position = position || teamMember.position;
    teamMember.bio = bio || teamMember.bio;
    teamMember.initials = initials || teamMember.initials;
    teamMember.order = order !== undefined ? order : teamMember.order;
    teamMember.isActive =
      isActive !== undefined ? isActive : teamMember.isActive;

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (teamMember.image) {
        const oldImagePath = path.join(__dirname, "..", teamMember.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      teamMember.image = `/uploads/team/${req.file.filename}`;
    }

    await teamMember.save();
    res.json(teamMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete team member
exports.deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    // Delete image file
    if (teamMember.image) {
      const imagePath = path.join(__dirname, "..", teamMember.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Upload middleware
exports.uploadImage = upload.single("image");
