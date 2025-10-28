require("dotenv").config();
const Feature = require("../models/Feature");

exports.createFeature = async (req, res, next) => {
  try {
    const { title, description, icon, isActive } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const feature = new Feature({
      title: title.trim(),
      description,
      icon: icon || "FaLeaf",
      isActive: isActive === "true" || isActive === true,
    });

    await feature.save();
    res.status(201).json(feature);
  } catch (err) {
    console.error("createFeature error:", err);
    next(err);
  }
};

exports.updateFeature = async (req, res, next) => {
  try {
    const featureId = req.params.id;
    const { title, description, icon, isActive } = req.body;

    // Prepare update object
    const updateData = {};

    // Update fields if provided
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (isActive !== undefined)
      updateData.isActive = isActive === "true" || isActive === true;

    // Use findOneAndUpdate for atomic operation
    const feature = await Feature.findOneAndUpdate(
      { _id: featureId },
      { $set: updateData },
      { new: true, runValidators: false }
    );

    if (!feature) {
      return res.status(404).json({ message: "Feature not found" });
    }

    res.json(feature);
  } catch (err) {
    console.error("updateFeature error:", err);
    next(err);
  }
};

exports.getFeatures = async (req, res, next) => {
  try {
    const features = await Feature.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json(features);
  } catch (err) {
    console.error("getFeatures error:", err);
    next(err);
  }
};

exports.getAllFeatures = async (req, res, next) => {
  try {
    const features = await Feature.find({}).sort({ createdAt: -1 });
    res.json(features);
  } catch (err) {
    console.error("getAllFeatures error:", err);
    next(err);
  }
};

exports.getFeature = async (req, res, next) => {
  try {
    const feature = await Feature.findById(req.params.id);
    if (!feature) {
      return res.status(404).json({ message: "Feature not found" });
    }
    res.json(feature);
  } catch (err) {
    console.error("getFeature error:", err);
    next(err);
  }
};

exports.deleteFeature = async (req, res, next) => {
  try {
    const feature = await Feature.findById(req.params.id);

    if (!feature) {
      return res.status(404).json({ message: "Feature not found" });
    }

    console.log("Deleting feature:", feature._id);

    await feature.deleteOne();
    console.log("Feature deleted successfully:", req.params.id);

    res.json({ message: "Feature removed" });
  } catch (err) {
    console.error("deleteFeature error:", err);
    next(err);
  }
};
