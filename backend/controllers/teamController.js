const Team = require("../models/Team");
const cloudinary = require("../config/cloudinary");
const path = require("path");
const fs = require("fs");

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

// Get all team members for admin
exports.getAllTeamMembersAdmin = async (req, res) => {
  try {
    // Fetch all members, active or not, for the admin panel
    const teamMembers = await Team.find({}).sort({ order: 1 });
    res.json(teamMembers);
  } catch (error) {
    console.error("Error fetching all team members for admin:", error);
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

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "gicheha-farm/team",
    });

    // Clean up local file
    fs.unlinkSync(req.file.path);

    const teamMember = new Team({
      name,
      position,
      bio,
      image: result.secure_url,
      public_id: result.public_id,
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
      // Delete old image from Cloudinary
      if (teamMember.public_id) {
        await cloudinary.uploader.destroy(teamMember.public_id);
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "gicheha-farm/team",
      });

      teamMember.image = result.secure_url;
      teamMember.public_id = result.public_id;

      // Clean up local file
      fs.unlinkSync(req.file.path);
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

    // Delete image from Cloudinary
    if (teamMember.public_id) {
      await cloudinary.uploader.destroy(teamMember.public_id);
    }

    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({ message: "Server error" });
  }
};
