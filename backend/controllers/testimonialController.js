const Testimonial = require("../models/Testimonial");
const cloudinary = require("../config/cloudinary");
const { validationResult } = require("express-validator");

// @desc    Get all approved testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true }).sort({
      createdAt: -1,
    });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all testimonials (admin)
// @route   GET /api/testimonials/admin
// @access  Private (Admin)
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Public
const createTestimonial = async (req, res) => {
  try {
    const { name, message, rating } = req.body;

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "gicheha-farm/testimonials",
      });
      imageUrl = result.secure_url;
    }

    const testimonial = new Testimonial({
      name: name || "Anonymous",
      message: message || "",
      rating: rating || 5,
      image: imageUrl || "",
      isApproved: false, // Admin testimonials are not auto-approved
    });

    const createdTestimonial = await testimonial.save();
    res.status(201).json(createdTestimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Admin)
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    const { name, message, rating, isApproved } = req.body;

    // Update fields if they are provided in the request
    if (name !== undefined) testimonial.name = name;
    if (message !== undefined) testimonial.message = message;
    if (rating !== undefined) testimonial.rating = rating;
    if (isApproved !== undefined)
      testimonial.isApproved = isApproved === "true" || isApproved === true;

    // Handle image update
    if (req.file) {
      // Optional: Delete old image from Cloudinary if you want to save space
      // if (testimonial.image) { ... }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "gicheha-farm/testimonials",
      });
      testimonial.image = result.secure_url;
    }

    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve testimonial
// @route   PUT /api/testimonials/:id/approve
// @access  Private (Admin)
const approveTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    testimonial.isApproved = true;
    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin)
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    await testimonial.deleteOne();
    res.json({ message: "Testimonial removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  approveTestimonial,
  deleteTestimonial,
};
