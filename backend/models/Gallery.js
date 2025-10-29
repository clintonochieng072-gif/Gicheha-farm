const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    image: {
      type: String, // Cloudinary URL for images
      required: false,
    },
    video: {
      type: String, // Cloudinary URL for videos
      required: false,
    },
    category: {
      type: String,
      default: "general",
      enum: ["farm", "products", "events", "general"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gallery", gallerySchema);
