require("dotenv").config();
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

const uploadFilesToCloudinary = async (files) => {
  if (!files || !files.length) return [];
  const uploads = files.map((file) =>
    cloudinary.uploader.upload(file.path, { folder: "gicheha_products" })
  );
  const results = await Promise.all(uploads);
  // Optionally remove local files after upload
  files.forEach((file) => {
    try {
      fs.unlink(file.path, () => {});
    } catch (e) {
      // noop
    }
  });
  return results.map((r) => r.secure_url);
};

exports.createProduct = async (req, res, next) => {
  try {
    // required fields validation - only name and price are required
    const { name, description, price, category, inStock, quantity, unit } =
      req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    // handle files
    const files = req.files || [];
    const images = await uploadFilesToCloudinary(files);

    const product = new Product({
      name,
      description: description || undefined,
      price,
      category: category || undefined,
      images,
      inStock: inStock === "true" || inStock === true,
      quantity: quantity || undefined,
      unit: unit || "kg",
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("createProduct error:", err);
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // update basic fields - all are optional except name and price if provided
    const updatable = [
      "name",
      "description",
      "price",
      "category",
      "inStock",
      "quantity",
      "unit",
    ];
    updatable.forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== "") {
        // coerce booleans and handle empty strings
        if (key === "inStock") {
          product[key] = req.body[key] === "true" || req.body[key] === true;
        } else if (req.body[key] === "") {
          product[key] = undefined;
        } else {
          product[key] = req.body[key];
        }
      }
    });

    // if new files were uploaded, upload them to cloudinary and replace images array
    const files = req.files || [];
    if (files.length > 0) {
      const images = await uploadFilesToCloudinary(files);
      product.images = images;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error("updateProduct error:", err);
    next(err);
  }
};

// other controller functions (getProducts, getProduct, deleteProduct) should also use next(err) on errors
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ inStock: true }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (err) {
    console.error("getProducts error:", err);
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("getProduct error:", err);
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Deleting product:", product._id);

    await product.deleteOne();
    console.log("Product deleted successfully:", req.params.id);

    res.json({ message: "Product removed" });
  } catch (err) {
    console.error("deleteProduct error:", err);
    next(err);
  }
};
