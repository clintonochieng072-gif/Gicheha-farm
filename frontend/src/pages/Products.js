import React, { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import { FaSearch, FaFilter } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import { useCart } from "../context/CartContext";
import SEO from "../components/SEO";

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const categories = ["all", "eggs", "cows", "sheep", "goat", "vegetables"];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products?t=${Date.now()}`);
      // Handle both array response (legacy) and object response with pagination
      const productsData = response.data.products || response.data;
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  // Structured data for products
  const productsStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Gicheha Farm Products",
    description:
      "Fresh, organic farm products including eggs, livestock, and vegetables from sustainable farming practices.",
    url: "https://gicheha-farm.onrender.com/public/products",
    numberOfItems: filteredProducts.length,
    itemListElement: filteredProducts.slice(0, 10).map((product, index) => ({
      "@type": "Product",
      position: index + 1,
      name: product.name,
      description: product.description,
      image: product.image
        ? `https://gicheha-farm.onrender.com${product.image}`
        : "https://gicheha-farm.onrender.com/logo192.png",
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "KES",
        availability: product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "Gicheha Farm Rongai",
        },
      },
      brand: {
        "@type": "Brand",
        name: "Gicheha Farm Rongai",
      },
      category: product.category,
      aggregateRating: product.rating
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount || 1,
          }
        : undefined,
    })),
  };

  return (
    <>
      <SEO
        title="Fresh Organic Products"
        description="Browse our wide range of fresh, organic farm products including eggs, livestock, and vegetables. Quality products from sustainable farming practices in Rongai, Kenya."
        keywords="organic products, fresh eggs, livestock, vegetables, farm products, Rongai Kenya, sustainable farming, buy organic"
        url="/public/products"
        structuredData={productsStructuredData}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-800 mb-4">
            Our Products
          </h1>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Discover our wide range of fresh, organic products straight from our
            farm to your table.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-secondary-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all"
                      ? "All Categories"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-secondary-600">
              <FaFilter className="mr-2" />
              <span>{filteredProducts.length} products</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-secondary-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary-600 text-lg">
              No products found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}

        {/* Product Categories Info */}
        <section className="mt-16 bg-secondary-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-secondary-800 mb-6 text-center">
            Product Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(1).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-4 rounded-lg text-center transition-colors ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white"
                    : "bg-white text-secondary-700 hover:bg-primary-50"
                }`}
              >
                <div className="font-semibold capitalize">{category}</div>
                <div className="text-sm opacity-75">
                  {
                    products.filter((p) => (p.category || "") === category)
                      .length
                  }{" "}
                  items
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Products;
