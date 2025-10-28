require("dotenv").config();
const SocialMedia = require("../models/SocialMedia");

exports.createSocialMedia = async (req, res, next) => {
  try {
    const { platform, url } = req.body;

    if (!platform || !url) {
      return res.status(400).json({ message: "Platform and URL are required" });
    }

    // Check if platform already exists
    const existingSocialMedia = await SocialMedia.findOne({ platform });
    if (existingSocialMedia) {
      return res
        .status(400)
        .json({ message: "Social media platform already exists" });
    }

    const socialMedia = new SocialMedia({
      platform,
      url: url.trim(),
    });

    await socialMedia.save();
    res.status(201).json(socialMedia);
  } catch (err) {
    console.error("createSocialMedia error:", err);
    next(err);
  }
};

exports.updateSocialMedia = async (req, res, next) => {
  try {
    const socialMediaId = req.params.id;
    const socialMedia = await SocialMedia.findById(socialMediaId);
    if (!socialMedia)
      return res.status(404).json({ message: "Social media not found" });

    const { platform, url, isActive } = req.body;

    // Check if new platform conflicts with existing one (excluding current one)
    if (platform && platform !== socialMedia.platform) {
      const existingSocialMedia = await SocialMedia.findOne({ platform });
      if (existingSocialMedia) {
        return res
          .status(400)
          .json({ message: "Social media platform already exists" });
      }
    }

    // Update fields
    if (platform !== undefined) socialMedia.platform = platform;
    if (url !== undefined) socialMedia.url = url.trim();
    if (isActive !== undefined) socialMedia.isActive = isActive;

    await socialMedia.save();
    res.json(socialMedia);
  } catch (err) {
    console.error("updateSocialMedia error:", err);
    next(err);
  }
};

exports.getSocialMedias = async (req, res, next) => {
  try {
    const socialMedias = await SocialMedia.find({}).sort({ createdAt: -1 });
    res.json(socialMedias);
  } catch (err) {
    console.error("getSocialMedias error:", err);
    next(err);
  }
};

exports.getSocialMedia = async (req, res, next) => {
  try {
    const socialMedia = await SocialMedia.findById(req.params.id);
    if (!socialMedia) {
      return res.status(404).json({ message: "Social media not found" });
    }
    res.json(socialMedia);
  } catch (err) {
    console.error("getSocialMedia error:", err);
    next(err);
  }
};

exports.deleteSocialMedia = async (req, res, next) => {
  try {
    const socialMedia = await SocialMedia.findById(req.params.id);

    if (!socialMedia) {
      return res.status(404).json({ message: "Social media not found" });
    }

    console.log("Deleting social media:", socialMedia._id);

    await socialMedia.deleteOne();
    console.log("Social media deleted successfully:", req.params.id);

    res.json({ message: "Social media removed" });
  } catch (err) {
    console.error("deleteSocialMedia error:", err);
    next(err);
  }
};
