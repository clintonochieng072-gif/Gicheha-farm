const Unit = require("../models/Unit");

// Get all units
exports.getUnits = async (req, res, next) => {
  try {
    const units = await Unit.find().sort({ createdAt: -1 });
    res.json(units);
  } catch (err) {
    console.error("getUnits error:", err);
    next(err);
  }
};

// Get single unit
exports.getUnit = async (req, res, next) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }
    res.json(unit);
  } catch (err) {
    console.error("getUnit error:", err);
    next(err);
  }
};

// Create unit
exports.createUnit = async (req, res, next) => {
  try {
    const { name, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Unit name is required" });
    }

    // Check if unit name already exists
    const existingUnit = await Unit.findOne({
      name: name.trim(),
    });
    if (existingUnit) {
      return res.status(400).json({ message: "Unit name already exists" });
    }

    const unit = new Unit({
      name: name.trim(),
      isActive: isActive !== undefined ? isActive : true,
    });

    await unit.save();
    res.status(201).json(unit);
  } catch (err) {
    console.error("createUnit error:", err);
    next(err);
  }
};

// Update unit
exports.updateUnit = async (req, res, next) => {
  try {
    const unitId = req.params.id;
    const { name, isActive } = req.body;

    // Prepare update object
    const updateData = {};

    // Check if new name conflicts with existing unit (excluding current one)
    if (name !== undefined) {
      const existingUnit = await Unit.findOne({
        name: name.trim(),
        _id: { $ne: unitId },
      });
      if (existingUnit) {
        return res.status(400).json({ message: "Unit name already exists" });
      }
      updateData.name = name.trim();
    }

    // Update active status
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    // Use findOneAndUpdate for atomic operation
    const unit = await Unit.findOneAndUpdate(
      { _id: unitId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    res.json(unit);
  } catch (err) {
    console.error("updateUnit error:", err);
    next(err);
  }
};

// Delete unit
exports.deleteUnit = async (req, res, next) => {
  try {
    const unit = await Unit.findByIdAndDelete(req.params.id);
    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }
    res.json({ message: "Unit deleted successfully" });
  } catch (err) {
    console.error("deleteUnit error:", err);
    next(err);
  }
};
