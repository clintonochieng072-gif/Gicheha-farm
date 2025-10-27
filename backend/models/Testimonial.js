const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    message: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      required: false,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    image: {
      type: String, // Cloudinary URL for customer photo
      default: "",
    },
    isApproved: {
      type: Boolean,
      default: false, // Admin approval required
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
