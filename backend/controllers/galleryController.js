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

// @desc    Create new gallery item (image or video)
// @route   POST /api/gallery
// @access  Private (Admin)
const createGalleryImage = async (req, res) => {
  try {
    const { title, description, category, type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const itemType = type || "image";

    let result;
    if (itemType === "video") {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "gicheha-farm/gallery/videos",
        resource_type: "video",
      });
    } else {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "gicheha-farm/gallery/images",
      });
    }

    const galleryItem = new Gallery({
      title: title || `Untitled ${itemType}`,
      description: description || "",
      type: itemType,
      image: itemType === "image" ? result.secure_url : null,
      video: itemType === "video" ? result.secure_url : null,
      category: category || "general",
      isActive: true,
    });

    const createdItem = await galleryItem.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private (Admin)
const updateGalleryImage = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    const { title, description, category, isActive, type } = req.body;

    if (req.file) {
      const itemType = type || galleryItem.type;
      let result;

      if (itemType === "video") {
        result = await cloudinary.uploader.upload(req.file.path, {
          folder: "gicheha-farm/gallery/videos",
          resource_type: "video",
        });
        galleryItem.video = result.secure_url;
        galleryItem.image = null; // Clear image if switching to video
      } else {
        result = await cloudinary.uploader.upload(req.file.path, {
          folder: "gicheha-farm/gallery/images",
        });
        galleryItem.image = result.secure_url;
        galleryItem.video = null; // Clear video if switching to image
      }
    }

    galleryItem.title = title !== undefined ? title : galleryItem.title;
    galleryItem.description =
      description !== undefined ? description : galleryItem.description;
    galleryItem.category =
      category !== undefined ? category : galleryItem.category;
    galleryItem.type = type !== undefined ? type : galleryItem.type;
    galleryItem.isActive =
      isActive !== undefined ? isActive : galleryItem.isActive;

    const updatedItem = await galleryItem.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private (Admin)
const deleteGalleryImage = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    await galleryItem.deleteOne();
    res.json({ message: "Gallery item removed" });
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
