const Gallery = require("../models/Gallery");
const cloudinary = require("../config/cloudinary");
const { validationResult } = require("express-validator");

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new gallery image
// @route   POST /api/gallery
// @access  Private (Admin)
const createGalleryImage = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "gicheha-farm/gallery",
    });

    const galleryImage = new Gallery({
      title: title || "Untitled Image",
      description: description || "",
      image: result.secure_url,
      category: category || "general",
      isActive: true,
    });

    const createdImage = await galleryImage.save();
    res.status(201).json(createdImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private (Admin)
const updateGalleryImage = async (req, res) => {
  try {
    const galleryImage = await Gallery.findById(req.params.id);

    if (!galleryImage) {
      return res.status(404).json({ message: "Gallery image not found" });
    }

    const { title, description, category, isActive } = req.body;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "gicheha-farm/gallery",
      });
      galleryImage.image = result.secure_url;
    }

    galleryImage.title = title !== undefined ? title : galleryImage.title;
    galleryImage.description =
      description !== undefined ? description : galleryImage.description;
    galleryImage.category =
      category !== undefined ? category : galleryImage.category;
    galleryImage.isActive =
      isActive !== undefined ? isActive : galleryImage.isActive;

    const updatedImage = await galleryImage.save();
    res.json(updatedImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private (Admin)
const deleteGalleryImage = async (req, res) => {
  try {
    const galleryImage = await Gallery.findById(req.params.id);

    if (!galleryImage) {
      return res.status(404).json({ message: "Gallery image not found" });
    }

    await galleryImage.deleteOne();
    res.json({ message: "Gallery image removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGallery,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
};
