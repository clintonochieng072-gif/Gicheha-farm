require("dotenv").config(); // ensure env loaded before anything else

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database");
const productRoutes = require("./routes/productRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const socialMediaRoutes = require("./routes/socialMediaRoutes");
const logoRoutes = require("./routes/logoRoutes");
const unitRoutes = require("./routes/unitRoutes");
const featureRoutes = require("./routes/featureRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const teamRoutes = require("./routes/teamRoutes");
const path = require("path");

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://gicheha-farm-1.onrender.com",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Middleware
app.use(cookieParser());
app.use(express.json());

// register routes
app.use("/api/products", productRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/social-media", socialMediaRoutes);
app.use("/api/logos", logoRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/features", featureRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/team", teamRoutes);

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
