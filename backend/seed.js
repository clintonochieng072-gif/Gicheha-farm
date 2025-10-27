const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const Testimonial = require("./models/Testimonial");
const Gallery = require("./models/Gallery");
const Admin = require("./models/Admin");
const connectDB = require("./config/database");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const products = [
  {
    name: "Fresh Tomatoes",
    description: "Juicy, ripe tomatoes grown organically in our farm.",
    price: 50,
    category: "vegetables",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/products/tomatoes.jpg",
    inStock: true,
    quantity: 100,
    unit: "kg",
  },
  {
    name: "Organic Carrots",
    description: "Sweet and crunchy carrots, perfect for your meals.",
    price: 40,
    category: "vegetables",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/products/carrots.jpg",
    inStock: true,
    quantity: 80,
    unit: "kg",
  },
  {
    name: "Fresh Milk",
    description: "Pure, fresh milk from our healthy cows.",
    price: 120,
    category: "dairy",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/products/milk.jpg",
    inStock: true,
    quantity: 50,
    unit: "liters",
  },
  {
    name: "Free-Range Eggs",
    description: "Nutritious eggs from our free-range chickens.",
    price: 300,
    category: "dairy",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/products/eggs.jpg",
    inStock: true,
    quantity: 200,
    unit: "dozen",
  },
  {
    name: "Sweet Mangoes",
    description: "Delicious, sweet mangoes harvested at peak ripeness.",
    price: 80,
    category: "fruits",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/products/mangoes.jpg",
    inStock: true,
    quantity: 60,
    unit: "kg",
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
    message: "Amazing farm-fresh products. The tomatoes are incredible!",
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
    title: "Our Tomato Fields",
    description: "Vibrant tomato fields in full bloom.",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/gallery/tomato-fields.jpg",
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
    title: "Product Display",
    description: "Our fresh products ready for delivery.",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1234567890/gicheha-farm/gallery/products.jpg",
    category: "products",
    isActive: true,
  },
];

const adminUser = {
  email: "Gicheharongai@gmail.com",
  password: "admin123456",
  role: "admin",
};

const importData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await Testimonial.deleteMany();
    await Gallery.deleteMany();
    await Admin.deleteMany();

    // Insert new data
    await Product.insertMany(products);
    await Testimonial.insertMany(testimonials);
    await Gallery.insertMany(galleryImages);

    // Create admin user
    const admin = new Admin(adminUser);
    await admin.save();

    console.log("Data Imported!");
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
