const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      enum: ["history", "mission", "values"],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
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

module.exports = mongoose.model("About", aboutSchema);
