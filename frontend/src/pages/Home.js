import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import TestimonialCard from "../components/TestimonialCard";
import { FaLeaf, FaTruck, FaShieldAlt, FaUsers } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const Home = () => {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, testimonialsRes] = await Promise.all([
        axios.get("/api/products"),
        axios.get("/api/testimonials"),
      ]);

      // Get first 12 products for homepage display
      setFeaturedProducts(productsRes.data.slice(0, 12));
      // Get first 3 testimonials
      setTestimonials(testimonialsRes.data.slice(0, 3));
      // Store total products count for display
      setTotalProducts(productsRes.data.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaLeaf className="text-primary-600 text-3xl" />,
      title: "Organic & Fresh",
      description:
        "All our products are grown organically without harmful chemicals.",
    },
    {
      icon: <FaTruck className="text-primary-600 text-3xl" />,
      title: "Fast Delivery",
      description: "Quick and reliable delivery straight to your doorstep.",
    },
    {
      icon: <FaShieldAlt className="text-primary-600 text-3xl" />,
      title: "Quality Assured",
      description: "Every product goes through rigorous quality checks.",
    },
    {
      icon: <FaUsers className="text-primary-600 text-3xl" />,
      title: "Community Focused",
      description:
        "Supporting local farmers and building sustainable communities.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-50 to-primary-100 py-20 overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-1/3 h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
            }}
          ></div>
          <div
            className="absolute top-0 right-0 w-1/3 h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
            }}
          ></div>
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-2/3 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-800 mb-6">
              Fresh From Our Farm
              <span className="text-primary-600 block">To Your Table</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
              Discover the finest organic produce from Gicheha Farm Rongai.
              Quality, freshness, and sustainability in every bite.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn-primary text-lg px-8 py-3">
                Shop Now
              </Link>
              <Link to="/about" className="btn-secondary text-lg px-8 py-3">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">
                About Gicheha Farm
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-primary-600 mb-3">
                    Our History
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    Founded in Rongai, Kenya, Gicheha Farm has been a
                    cornerstone of sustainable agriculture for over two decades.
                    What started as a small family farm has grown into a trusted
                    source of fresh, organic produce for our community and
                    beyond.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary-600 mb-3">
                    Our Mission
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    To provide the highest quality organic produce while
                    promoting sustainable farming practices that benefit both
                    our customers and the environment. We are committed to
                    delivering freshness, nutrition, and exceptional service in
                    every product we offer.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary-600 mb-3">
                    Our Values
                  </h3>
                  <ul className="text-secondary-600 space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      <span>Sustainability in all farming practices</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      <span>Quality and freshness above all else</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      <span>Community support and local empowerment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      <span>Environmental stewardship and conservation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
                  }}
                ></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-3">
                  <FaLeaf className="text-primary-600 text-2xl" />
                  <div>
                    <div className="font-semibold text-secondary-800">
                      20+ Years
                    </div>
                    <div className="text-sm text-secondary-600">
                      Of Excellence
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">
              Featured Products
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Discover our wide range of fresh, organic products. Browse our
              latest offerings below.
            </p>
          </div>
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
              <div className="text-center">
                <Link to="/products" className="btn-primary">
                  View All Products ({Math.max(0, totalProducts - 12)} more
                  available)
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              We're committed to providing the highest quality products while
              supporting sustainable farming practices.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied
              customers.
            </p>
          </div>
          {loading ? (
            <div className="text-center py-8">Loading testimonials...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {testimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial._id}
                    testimonial={testimonial}
                  />
                ))}
              </div>
              <div className="text-center">
                <Link to="/testimonials" className="btn-secondary">
                  Read More Testimonials
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience Freshness?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who choose Gicheha Farm for
            their daily needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-primary-600 hover:bg-secondary-50 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Start Shopping
            </Link>
            <Link
              to="/gallery"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              View Our Gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
