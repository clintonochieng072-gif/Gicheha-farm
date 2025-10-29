const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const Testimonial = require("./models/Testimonial");
const Gallery = require("./models/Gallery");
const Admin = require("./models/Admin");
const Unit = require("./models/Unit");
const Feature = require("./models/Feature");
const About = require("./models/About");
const Team = require("./models/Team");
const connectDB = require("./config/database");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const products = [
  {
    name: "Fresh Eggs",
    description:
      "Farm-fresh eggs from our free-range chickens, rich in nutrients and flavor.",
    price: 300,
    category: "eggs",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/products/eggs.jpg",
    inStock: true,
    quantity: 200,
    unit: "dozen",
  },
  {
    name: "Live Cow",
    description: "Healthy dairy cow, perfect for milk production and breeding.",
    price: 45000,
    category: "cows",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/products/cow.jpg",
    inStock: true,
    quantity: 5,
    unit: "single piece",
  },
  {
    name: "Live Sheep",
    description: "Quality sheep for meat and wool production.",
    price: 15000,
    category: "sheep",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/products/sheep.jpg",
    inStock: true,
    quantity: 8,
    unit: "single piece",
  },
  {
    name: "Live Goat",
    description: "Healthy goat for milk and meat production.",
    price: 12000,
    category: "goat",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/products/goat.jpg",
    inStock: true,
    quantity: 12,
    unit: "single piece",
  },
  {
    name: "Fresh Vegetables Mix",
    description: "Assortment of fresh, organic vegetables from our farm.",
    price: 150,
    category: "vegetables",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/products/vegetables.jpg",
    inStock: true,
    quantity: 50,
    unit: "kg",
  },
  {
    name: "Fresh Milk",
    description: "Pure, fresh milk from our healthy cows.",
    price: 120,
    category: "cows",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/products/milk.jpg",
    inStock: true,
    quantity: 30,
    unit: "liters",
  },
];

const testimonials = [
  {
    name: "John Doe",
    message:
      "The freshest produce I have ever tasted! Gicheha Farm delivers quality every time.",
    rating: 5,
    isApproved: true,
  },
  {
    name: "Jane Smith",
    message: "Amazing farm-fresh products. The eggs are incredible!",
    rating: 5,
    isApproved: true,
  },
  {
    name: "Mike Johnson",
    message: "Great service and high-quality products. Highly recommended!",
    rating: 4,
    isApproved: true,
  },
];

const galleryImages = [
  {
    title: "Our Livestock",
    description: "Healthy cows, sheep, and goats grazing in our pastures.",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/gallery/livestock.jpg",
    category: "farm",
    isActive: true,
  },
  {
    title: "Fresh Harvest",
    description: "Workers harvesting fresh vegetables.",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/gallery/harvest.jpg",
    category: "farm",
    isActive: true,
  },
  {
    title: "Egg Production",
    description: "Our chicken coop producing fresh eggs daily.",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/gallery/eggs.jpg",
    category: "farm",
    isActive: true,
  },
];

const units = [
  { name: "kg", isActive: true },
  { name: "lbs", isActive: true },
  { name: "pieces", isActive: true },
  { name: "liters", isActive: true },
  { name: "dozen", isActive: true },
  { name: "tray", isActive: true },
  { name: "single piece", isActive: true },
];

const features = [
  {
    title: "Fresh Eggs",
    description: "Farm-fresh eggs from our free-range chickens.",
    icon: "FaEgg",
    isActive: true,
  },
  {
    title: "Healthy Livestock",
    description: "Quality cows, sheep, and goats for all your needs.",
    icon: "FaHorse",
    isActive: true,
  },
  {
    title: "Organic Vegetables",
    description: "Fresh, organic vegetables grown sustainably.",
    icon: "FaCarrot",
    isActive: true,
  },
  {
    title: "Fast Delivery",
    description: "Quick and reliable delivery straight to your doorstep.",
    icon: "FaTruck",
    isActive: true,
  },
  {
    title: "Quality Assured",
    description: "Every product goes through rigorous quality checks.",
    icon: "FaShieldAlt",
    isActive: true,
  },
  {
    title: "Community Focused",
    description:
      "Supporting local farmers and building sustainable communities.",
    icon: "FaUsers",
    isActive: true,
  },
];

const abouts = [
  {
    section: "history",
    title: "Our History",
    content:
      "Founded in Rongai, Kenya, Gicheha Farm has been a cornerstone of sustainable agriculture for over two decades. What started as a small family farm has grown into a trusted source of fresh, organic produce for our community and beyond.",
    isActive: true,
  },
  {
    section: "mission",
    title: "Our Mission",
    content:
      "To provide the highest quality organic produce while promoting sustainable farming practices that benefit both our customers and the environment. We are committed to delivering freshness, nutrition, and exceptional service in every product we offer.",
    isActive: true,
  },
  {
    section: "values",
    title: "Our Values",
    content:
      "• Sustainability in all farming practices\n• Quality and freshness above all else\n• Community support and local empowerment\n• Environmental stewardship and conservation",
    isActive: true,
  },
];

const teamMembers = [
  {
    name: "John Gicheha",
    position: "Founder & Farmer",
    bio: "With over 20 years of farming experience, John leads our sustainable farming initiatives.",
    initials: "JG",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/team/john.jpg",
    isActive: true,
    order: 1,
  },
  {
    name: "Mary Wanjiku",
    position: "Farm Manager",
    bio: "Mary oversees daily operations and ensures our products meet the highest quality standards.",
    initials: "MW",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/team/mary.jpg",
    isActive: true,
    order: 2,
  },
  {
    name: "David Kiprop",
    position: "Quality Control",
    bio: "David manages our quality assurance processes and product testing.",
    initials: "DK",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/team/david.jpg",
    isActive: true,
    order: 3,
  },
];

const adminUser = {
  email: "Gicheharongai@gmail.com",
  password: "admin123456",
  role: "admin",
};

const importData = async () => {
  try {
    // Check if data already exists
    const existingProducts = await Product.countDocuments();
    const existingAdmins = await Admin.countDocuments();
    const existingUnits = await Unit.countDocuments();
    const existingFeatures = await Feature.countDocuments();
    const existingAbouts = await About.countDocuments();
    const existingTeam = await Team.countDocuments();

    if (
      existingProducts > 0 ||
      existingAdmins > 0 ||
      existingUnits > 0 ||
      existingFeatures > 0 ||
      existingAbouts > 0 ||
      existingTeam > 0
    ) {
      console.log(
        "Data already exists! Skipping seed to preserve existing data."
      );
      console.log(
        `Found ${existingProducts} products, ${existingAdmins} admin users, ${existingUnits} units, ${existingFeatures} features, ${existingAbouts} about entries, and ${existingTeam} team members.`
      );
      process.exit();
    }

    // Only seed if database is empty
    console.log("Database is empty. Seeding initial data...");

    // Insert new data
    await Product.insertMany(products);
    await Testimonial.insertMany(testimonials);
    await Gallery.insertMany(galleryImages);
    await Unit.insertMany(units);
    await Feature.insertMany(features);
    await About.insertMany(abouts);
    await Team.insertMany(teamMembers);

    // Create admin user
    const admin = new Admin(adminUser);
    await admin.save();

    console.log("Initial data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await Testimonial.deleteMany();
    await Gallery.deleteMany();
    await Admin.deleteMany();
    await Unit.deleteMany();
    await Feature.deleteMany();
    await About.deleteMany();
    await Team.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error("Error destroying data:", error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
