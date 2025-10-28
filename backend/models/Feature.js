const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
      enum: [
        "FaEgg",
        "FaHorse",
        "FaCarrot",
        "FaTruck",
        "FaShieldAlt",
        "FaUsers",
        "FaLeaf",
        "FaSeedling",
        "FaTractor",
        "FaMapMarkerAlt",
      ],
      default: "FaLeaf",
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

module.exports = mongoose.model("Feature", featureSchema);
