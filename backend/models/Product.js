const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
      index: true, // Index for search queries
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
      min: [0, "Price cannot be negative"],
      index: true, // Index for price filtering
    },
    category: {
      type: String,
      required: false,
      default: "",
      index: true, // Index for category filtering
    },
    images: {
      type: [String], // Array of Cloudinary URLs
      required: false,
      default: ["https://via.placeholder.com/300x200?text=No+Image"],
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true, // Index for filtering in-stock products
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, "Quantity cannot be negative"],
    },
    unit: {
      type: String,
      default: "kg",
      enum: ["kg", "lbs", "pieces", "liters", "dozen", "tray", "single piece"],
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for better query performance
productSchema.index({ inStock: 1, createdAt: -1 }); // For homepage featured products
productSchema.index({ category: 1, inStock: 1 }); // For category filtering
productSchema.index({ price: 1, inStock: 1 }); // For price sorting

module.exports = mongoose.model("Product", productSchema);
