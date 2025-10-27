require("dotenv").config(); // ensure env loaded before anything else

const express = require("express");
const connectDB = require("./config/database");
const productRoutes = require("./routes/productRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const path = require("path");

const app = express();

app.use(express.json());

// register routes
app.use("/api/products", productRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/admin", adminRoutes);

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Gicheha Farm Backend is running" });
});

// 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// centralized error handler (prints stack in development)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  const payload = {
    message:
      process.env.NODE_ENV === "development"
        ? err.message || "Something went wrong!"
        : "Something went wrong!",
  };
  if (process.env.NODE_ENV === "development") payload.stack = err.stack;
  res.status(status).json(payload);
});

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

start();
