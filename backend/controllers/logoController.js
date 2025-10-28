require("dotenv").config();
const Logo = require("../models/Logo");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

const uploadLogoToCloudinary = async (file) => {
  if (!file) return null;
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "gicheha_logos",
    public_id: `logo_${Date.now()}`,
  });
  // Remove local file after upload
  try {
    fs.unlink(file.path, () => {});
  } catch (e) {
    // noop
  }
  return result.secure_url;
};

exports.createLogo = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Logo name is required" });
    }

    // Check if logo name already exists
    const existingLogo = await Logo.findOne({ name: name.trim() });
    if (existingLogo) {
      return res.status(400).json({ message: "Logo name already exists" });
    }

    // Handle file upload
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Logo image is required" });
    }

    const url = await uploadLogoToCloudinary(file);

    const logo = new Logo({
      name: name.trim(),
      url,
    });

    await logo.save();
    res.status(201).json(logo);
  } catch (err) {
    console.error("createLogo error:", err);
    next(err);
  }
};

exports.updateLogo = async (req, res, next) => {
  try {
    const logoId = req.params.id;
    const logo = await Logo.findById(logoId);
    if (!logo) return res.status(404).json({ message: "Logo not found" });

    const { name, isActive } = req.body;

    // Check if new name conflicts with existing logo (excluding current one)
    if (name && name.trim() !== logo.name) {
      const existingLogo = await Logo.findOne({ name: name.trim() });
      if (existingLogo) {
        return res.status(400).json({ message: "Logo name already exists" });
      }
    }

    // Update fields
    if (name !== undefined) logo.name = name.trim();
    if (isActive !== undefined) logo.isActive = isActive;

    // Handle file upload if new image provided
    const file = req.file;
    if (file) {
      const url = await uploadLogoToCloudinary(file);
      logo.url = url;
    }

    await logo.save();
    res.json(logo);
  } catch (err) {
    console.error("updateLogo error:", err);
    next(err);
  }
};

exports.getLogos = async (req, res, next) => {
  try {
    const logos = await Logo.find({}).sort({ createdAt: -1 });
    res.json(logos);
  } catch (err) {
    console.error("getLogos error:", err);
    next(err);
  }
};

exports.getActiveLogo = async (req, res, next) => {
  try {
    const logo = await Logo.findOne({ isActive: true });
    if (!logo) {
      return res.status(404).json({ message: "No active logo found" });
    }
    res.json(logo);
  } catch (err) {
    console.error("getActiveLogo error:", err);
    next(err);
  }
};

exports.getLogo = async (req, res, next) => {
  try {
    const logo = await Logo.findById(req.params.id);
    if (!logo) {
      return res.status(404).json({ message: "Logo not found" });
    }
    res.json(logo);
  } catch (err) {
    console.error("getLogo error:", err);
    next(err);
  }
};

exports.deleteLogo = async (req, res, next) => {
  try {
    const logo = await Logo.findById(req.params.id);

    if (!logo) {
      return res.status(404).json({ message: "Logo not found" });
    }

    console.log("Deleting logo:", logo._id);

    await logo.deleteOne();
    console.log("Logo deleted successfully:", req.params.id);

    res.json({ message: "Logo removed" });
  } catch (err) {
    console.error("deleteLogo error:", err);
    next(err);
  }
};
