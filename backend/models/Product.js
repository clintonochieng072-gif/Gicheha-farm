const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: false,
      default: "",
    },
    images: {
      type: [String], // Array of Cloudinary URLs
      required: false,
      default: ["https://via.placeholder.com/300x200?text=No+Image"],
    },
    inStock: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model("Product", productSchema);
