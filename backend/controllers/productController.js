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

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("createProduct error:", err);
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;

    // First, check if product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Prepare update object
    const updateData = {};

    // update basic fields - all are optional, allow empty strings and undefined values
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
      if (req.body[key] !== undefined) {
        // coerce booleans and handle empty strings as valid updates
        if (key === "inStock") {
          updateData[key] = req.body[key] === "true" || req.body[key] === true;
        } else if (req.body[key] === "") {
          updateData[key] = undefined; // allow clearing fields
        } else {
          updateData[key] = req.body[key];
        }
      }
    });

    // if new files were uploaded, upload them to cloudinary and replace images array
    const files = req.files || [];
    if (files.length > 0) {
      const images = await uploadFilesToCloudinary(files);
      updateData.images = images;
    }

    // Use findOneAndUpdate for atomic operation to avoid version conflicts
    const product = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: updateData },
      {
        new: true, // return the updated document
        runValidators: true, // run schema validators
        upsert: false, // don't create new document if not found
      }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("updateProduct error:", err);
    next(err);
  }
};

// other controller functions (getProducts, getProduct, deleteProduct) should also use next(err) on errors
exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12; // Default 12 products per page
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { inStock: true };

    // Add category filter if provided
    if (req.query.category && req.query.category !== "all") {
      filter.category = req.query.category;
    }

    // Add search filter if provided
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Build sort object
    let sort = { createdAt: -1 }; // Default sort by newest
    if (req.query.sort === "price_asc") {
      sort = { price: 1 };
    } else if (req.query.sort === "price_desc") {
      sort = { price: -1 };
    } else if (req.query.sort === "name") {
      sort = { name: 1 };
    }

    // Execute query with pagination
    const products = await Product.find(filter)
      .select("name price images category unit quantity") // Only select needed fields
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
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
