const mongoose = require("mongoose");

const socialMediaSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: [
        "facebook",
        "instagram",
        "linkedin",
        "twitter",
        "youtube",
        "whatsapp",
      ],
    },
    url: {
      type: String,
      required: true,
      trim: true,
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

module.exports = mongoose.model("SocialMedia", socialMediaSchema);
