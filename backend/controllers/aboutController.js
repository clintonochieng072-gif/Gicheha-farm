require("dotenv").config();
const About = require("../models/About");

exports.createAbout = async (req, res, next) => {
  try {
    const { section, title, content, isActive } = req.body;

    if (!section || !title || !content) {
      return res
        .status(400)
        .json({ message: "Section, title, and content are required" });
    }

    // Validate section enum
    const validSections = ["history", "mission", "values"];
    if (!validSections.includes(section)) {
      return res
        .status(400)
        .json({
          message: "Invalid section. Must be one of: history, mission, values",
        });
    }

    const about = new About({
      section,
      title: title.trim(),
      content,
      isActive: isActive === "true" || isActive === true,
    });

    await about.save();
    res.status(201).json(about);
  } catch (err) {
    console.error("createAbout error:", err);
    next(err);
  }
};

exports.updateAbout = async (req, res, next) => {
  try {
    const aboutId = req.params.id;
    const { section, title, content, isActive } = req.body;

    // Prepare update object
    const updateData = {};

    // Validate section if provided
    if (section !== undefined) {
      const validSections = ["history", "mission", "values"];
      if (!validSections.includes(section)) {
        return res
          .status(400)
          .json({
            message:
              "Invalid section. Must be one of: history, mission, values",
          });
      }
      updateData.section = section;
    }

    // Update other fields if provided
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content;
    if (isActive !== undefined)
      updateData.isActive = isActive === "true" || isActive === true;

    // Use findOneAndUpdate for atomic operation
    const about = await About.findOneAndUpdate(
      { _id: aboutId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!about) {
      return res.status(404).json({ message: "About content not found" });
    }

    res.json(about);
  } catch (err) {
    console.error("updateAbout error:", err);
    next(err);
  }
};

exports.getAbouts = async (req, res, next) => {
  try {
    const abouts = await About.find({ isActive: true }).sort({
      section: 1,
      createdAt: -1,
    });
    res.json(abouts);
  } catch (err) {
    console.error("getAbouts error:", err);
    next(err);
  }
};

exports.getAllAbouts = async (req, res, next) => {
  try {
    const abouts = await About.find({}).sort({ section: 1, createdAt: -1 });
    res.json(abouts);
  } catch (err) {
    console.error("getAllAbouts error:", err);
    next(err);
  }
};

exports.getAbout = async (req, res, next) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) {
      return res.status(404).json({ message: "About content not found" });
    }
    res.json(about);
  } catch (err) {
    console.error("getAbout error:", err);
    next(err);
  }
};

exports.deleteAbout = async (req, res, next) => {
  try {
    const about = await About.findById(req.params.id);

    if (!about) {
      return res.status(404).json({ message: "About content not found" });
    }

    console.log("Deleting about content:", about._id);

    await about.deleteOne();
    console.log("About content deleted successfully:", req.params.id);

    res.json({ message: "About content removed" });
  } catch (err) {
    console.error("deleteAbout error:", err);
    next(err);
  }
};
