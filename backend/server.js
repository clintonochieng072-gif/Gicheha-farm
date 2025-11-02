require("dotenv").config(); // ensure env loaded before anything else

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
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

// Compression middleware - compress all responses
app.use(
  compression({
    level: 6, // compression level (1-9, 6 is good balance)
    threshold: 1024, // only compress responses larger than 1KB
    filter: (req, res) => {
      // Don't compress responses with this request header
      if (req.headers["x-no-compression"]) {
        return false;
      }
      // Use compression filter function
      return compression.filter(req, res);
    },
  })
);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "https://gicheha-farm-1.onrender.com",
      "https://gicheha-farm.onrender.com",
      "http://localhost:3000",
      "http://localhost:3001",
      process.env.FRONTEND_URL,
    ].filter(Boolean); // Remove undefined values

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "Pragma",
    "Expires",
  ],
};
app.use(cors(corsOptions));

// Middleware
app.use(cookieParser());
app.use(express.json());

// Security Middleware
app.use(helmet());

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

// Determine the root directory of the project
const projectRoot = path.join(__dirname, "..");

// --- Serving Frontend ---
// Serve static files from the React app build directory
app.use(express.static(path.join(projectRoot, "frontend/build")));

// --- End Serving Frontend ---

// Serve static files from uploads directory with caching headers
app.use(
  "/uploads",
  express.static(path.join(projectRoot, "backend/uploads"), {
    maxAge: "30d", // Cache for 30 days
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      // Set cache control headers for different file types
      if (
        path.endsWith(".jpg") ||
        path.endsWith(".jpeg") ||
        path.endsWith(".png") ||
        path.endsWith(".gif") ||
        path.endsWith(".webp")
      ) {
        res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year for images
      } else if (path.endsWith(".css") || path.endsWith(".js")) {
        res.setHeader("Cache-Control", "public, max-age=86400"); // 1 day for CSS/JS
      }
    },
  })
);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Gicheha Farm Backend is running" });
});

// SEO Routes
// Sitemap.xml generation
app.get("/sitemap.xml", (req, res) => {
  const baseUrl =
    process.env.FRONTEND_URL || "https://gicheha-farm.onrender.com";

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/products</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/gallery</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/testimonials</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(sitemap);
});

// Robots.txt
app.get("/robots.txt", (req, res) => {
  const baseUrl =
    process.env.FRONTEND_URL || "https://gicheha-farm.onrender.com";

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  res.header("Content-Type", "text/plain");
  res.send(robotsTxt);
});

// 404 for API routes
app.use("/api/*", (req, res, next) => {
  res.status(404).json({ message: "API endpoint not found" });
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

// Catch-all handler for client-side routing: send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(projectRoot, "frontend/build/index.html"));
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
