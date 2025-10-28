require("dotenv").config();
const Category = require("../models/Category");

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if category name already exists
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({ message: "Category name already exists" });
    }

    const category = new Category({
      name: name.trim(),
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error("createCategory error:", err);
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const { name, isActive } = req.body;

    // Prepare update object
    const updateData = {};

    // Check if new name conflicts with existing category (excluding current one)
    if (name !== undefined) {
      const existingCategory = await Category.findOne({
        name: name.trim(),
        _id: { $ne: categoryId },
      });
      if (existingCategory) {
        return res
          .status(400)
          .json({ message: "Category name already exists" });
      }
      updateData.name = name.trim();
    }

    // Update active status
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    // Use findOneAndUpdate for atomic operation
    const category = await Category.findOneAndUpdate(
      { _id: categoryId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    console.error("updateCategory error:", err);
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.error("getCategories error:", err);
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    console.error("getCategory error:", err);
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    console.log("Deleting category:", category._id);

    await category.deleteOne();
    console.log("Category deleted successfully:", req.params.id);

    res.json({ message: "Category removed" });
  } catch (err) {
    console.error("deleteCategory error:", err);
    next(err);
  }
};
