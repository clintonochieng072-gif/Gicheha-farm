import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import TestimonialCard from "../components/TestimonialCard";
import VideoCard from "../components/VideoCard";
import SocialMediaIcons from "../components/SocialMediaIcons";
import {
  FaLeaf,
  FaTruck,
  FaShieldAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaEgg,
  FaHorse,
  FaSeedling,
  FaTractor,
  FaCarrot,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Suppress the deprecated Marker warning
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0]?.includes &&
    args[0].includes("google.maps.Marker is deprecated")
  ) {
    return;
  }
  originalWarn(...args);
};

const Home = () => {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [features, setFeatures] = useState([]);
  const [abouts, setAbouts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [socialMedia, setSocialMedia] = useState([]);
  const [team, setTeam] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({
    products: true,
    testimonials: true,
    features: true,
    abouts: true,
    videos: true,
    socialMedia: true,
    team: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch data with individual loading states for better UX
      const fetchPromises = [
        api
          .get(`/products?limit=12&t=${Date.now()}`)
          .then((res) => {
            const productsData = Array.isArray(res.data.products)
              ? res.data.products
              : [];
            setFeaturedProducts(productsData);
            setTotalProducts(
              res.data.pagination?.totalProducts || productsData.length
            );
            setLoadingStates((prev) => ({ ...prev, products: false }));
          })
          .catch((err) => {
            console.error("Products fetch error:", err);
            setFeaturedProducts([]);
            setTotalProducts(0);
            setLoadingStates((prev) => ({ ...prev, products: false }));
          }),

        api
          .get(`/testimonials?t=${Date.now()}`)
          .then((res) => {
            const testimonialsData = Array.isArray(res.data)
              ? res.data.slice(0, 3)
              : [];
            setTestimonials(testimonialsData);
            setLoadingStates((prev) => ({ ...prev, testimonials: false }));
          })
          .catch((err) => {
            console.error("Testimonials fetch error:", err);
            setTestimonials([]);
            setLoadingStates((prev) => ({ ...prev, testimonials: false }));
          }),

        api
          .get(`/features?t=${Date.now()}`)
          .then((res) => {
            const featuresData = Array.isArray(res.data) ? res.data : [];
            setFeatures(featuresData);
            setLoadingStates((prev) => ({ ...prev, features: false }));
          })
          .catch((err) => {
            console.error("Features fetch error:", err);
            setFeatures([]);
            setLoadingStates((prev) => ({ ...prev, features: false }));
          }),

        api
          .get(`/about?t=${Date.now()}`)
          .then((res) => {
            const aboutsData = Array.isArray(res.data) ? res.data : [];
            setAbouts(aboutsData);
            setLoadingStates((prev) => ({ ...prev, abouts: false }));
          })
          .catch((err) => {
            console.error("About fetch error:", err);
            setAbouts([]);
            setLoadingStates((prev) => ({ ...prev, abouts: false }));
          }),

        api
          .get(`/gallery?t=${Date.now()}`)
          .then((res) => {
            const videosData = Array.isArray(res.data) ? res.data : [];
            const videoItems = videosData
              .filter((item) => item.type === "video")
              .slice(0, 6);
            setVideos(videoItems);
            setLoadingStates((prev) => ({ ...prev, videos: false }));
          })
          .catch((err) => {
            console.error("Gallery fetch error:", err);
            setVideos([]);
            setLoadingStates((prev) => ({ ...prev, videos: false }));
          }),

        api
          .get(`/social-media?t=${Date.now()}`)
          .then((res) => {
            const socialMediaData = Array.isArray(res.data) ? res.data : [];
            setSocialMedia(socialMediaData);
            setLoadingStates((prev) => ({ ...prev, socialMedia: false }));
          })
          .catch((err) => {
            console.error("Social media fetch error:", err);
            setSocialMedia([]);
            setLoadingStates((prev) => ({ ...prev, socialMedia: false }));
          }),

        api
          .get(`/team?t=${Date.now()}`)
          .then((res) => {
            const teamData = Array.isArray(res.data) ? res.data : [];
            setTeam(teamData);
            setLoadingStates((prev) => ({ ...prev, team: false }));
          })
          .catch((err) => {
            console.error("Team fetch error:", err);
            setTeam([]);
            setLoadingStates((prev) => ({ ...prev, team: false }));
          }),
      ];

      await Promise.allSettled(fetchPromises);

      // Set overall loading to false when all requests are complete
      setLoading(false);
    } catch (error) {
      console.error("Error in fetchData:", error);
      setLoading(false);
    }
  };

  const getIconComponent = (iconName) => {
    // If no icon name provided, return default
    if (!iconName) return <FaLeaf className="text-primary-600 text-3xl" />;

    // Normalize the icon name (lowercase, remove spaces, handle common variations)
    const normalizedIcon = iconName.toLowerCase().trim().replace(/\s+/g, "");

    // Extended icon mapping for common names
    const iconMap = {
      // Original FontAwesome icons
      faegg: <FaEgg className="text-primary-600 text-3xl" />,
      fahorse: <FaHorse className="text-primary-600 text-3xl" />,
      facarrot: <FaCarrot className="text-primary-600 text-3xl" />,
      fatruck: <FaTruck className="text-primary-600 text-3xl" />,
      fashieldalt: <FaShieldAlt className="text-primary-600 text-3xl" />,
      fausers: <FaUsers className="text-primary-600 text-3xl" />,
      faleaf: <FaLeaf className="text-primary-600 text-3xl" />,
      faseedling: <FaSeedling className="text-primary-600 text-3xl" />,
      fatractor: <FaTractor className="text-primary-600 text-3xl" />,
      famapmarkeralt: <FaMapMarkerAlt className="text-primary-600 text-3xl" />,

      // Common name mappings
      egg: <FaEgg className="text-primary-600 text-3xl" />,
      eggs: <FaEgg className="text-primary-600 text-3xl" />,
      horse: <FaHorse className="text-primary-600 text-3xl" />,
      carrot: <FaCarrot className="text-primary-600 text-3xl" />,
      truck: <FaTruck className="text-primary-600 text-3xl" />,
      delivery: <FaTruck className="text-primary-600 text-3xl" />,
      shield: <FaShieldAlt className="text-primary-600 text-3xl" />,
      quality: <FaShieldAlt className="text-primary-600 text-3xl" />,
      users: <FaUsers className="text-primary-600 text-3xl" />,
      community: <FaUsers className="text-primary-600 text-3xl" />,
      people: <FaUsers className="text-primary-600 text-3xl" />,
      leaf: <FaLeaf className="text-primary-600 text-3xl" />,
      seedling: <FaSeedling className="text-primary-600 text-3xl" />,
      tractor: <FaTractor className="text-primary-600 text-3xl" />,
      farm: <FaTractor className="text-primary-600 text-3xl" />,
      map: <FaMapMarkerAlt className="text-primary-600 text-3xl" />,
      location: <FaMapMarkerAlt className="text-primary-600 text-3xl" />,
      marker: <FaMapMarkerAlt className="text-primary-600 text-3xl" />,

      // Additional common icons that might be useful
      bike: <FaLeaf className="text-primary-600 text-3xl" />, // Using leaf as fallback for bike
      bicycle: <FaLeaf className="text-primary-600 text-3xl" />,
      car: <FaTruck className="text-primary-600 text-3xl" />, // Using truck as fallback for car
      vehicle: <FaTruck className="text-primary-600 text-3xl" />,
      organic: <FaLeaf className="text-primary-600 text-3xl" />,
      fresh: <FaLeaf className="text-primary-600 text-3xl" />,
      healthy: <FaLeaf className="text-primary-600 text-3xl" />,
      sustainable: <FaSeedling className="text-primary-600 text-3xl" />,
      environment: <FaLeaf className="text-primary-600 text-3xl" />,
      nature: <FaLeaf className="text-primary-600 text-3xl" />,
    };

    return (
      iconMap[normalizedIcon] || (
        <FaLeaf className="text-primary-600 text-3xl" />
      )
    );
  };

  const defaultFeatures = [
    {
      icon: <FaEgg className="text-primary-600 text-3xl" />,
      title: "Fresh Eggs",
      description: "Farm-fresh eggs from our free-range chickens.",
    },
    {
      icon: <FaHorse className="text-primary-600 text-3xl" />,
      title: "Healthy Livestock",
      description: "Quality cows, sheep, and goats for all your needs.",
    },
    {
      icon: <FaCarrot className="text-primary-600 text-3xl" />,
      title: "Organic Vegetables",
      description: "Fresh, organic vegetables grown sustainably.",
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

  const displayFeatures =
    features.length > 0
      ? features.map((feature) => ({
          icon: getIconComponent(feature.icon),
          title: feature.title,
          description: feature.description,
        }))
      : defaultFeatures;

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
              <Link
                to="/public/products"
                className="btn-primary text-lg px-8 py-3"
              >
                Shop Now
              </Link>
              <Link
                to="/public/about"
                className="btn-secondary text-lg px-8 py-3"
              >
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
                {abouts
                  .filter((about) => about.isActive)
                  .map((about) => (
                    <div key={about._id}>
                      <h3 className="text-xl font-semibold text-primary-600 mb-3">
                        {about.title}
                      </h3>
                      <p className="text-secondary-600 leading-relaxed">
                        {about.content}
                      </p>
                    </div>
                  ))}
                {abouts.filter((about) => about.isActive).length === 0 && (
                  <>
                    <div>
                      <h3 className="text-xl font-semibold text-primary-600 mb-3">
                        Our History
                      </h3>
                      <p className="text-secondary-600 leading-relaxed">
                        Founded in Rongai, Kenya, Gicheha Farm has been a
                        cornerstone of sustainable agriculture for over two
                        decades. What started as a small family farm has grown
                        into a trusted source of fresh, organic produce for our
                        community and beyond.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-primary-600 mb-3">
                        Our Mission
                      </h3>
                      <p className="text-secondary-600 leading-relaxed">
                        To provide the highest quality organic produce while
                        promoting sustainable farming practices that benefit
                        both our customers and the environment. We are committed
                        to delivering freshness, nutrition, and exceptional
                        service in every product we offer.
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
                          <span>
                            Environmental stewardship and conservation
                          </span>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
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

      {/* Videos Section */}
      {videos.length > 0 && (
        <section className="py-16 bg-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-4">
                Farm Videos
              </h2>
              <p className="text-secondary-600 max-w-2xl mx-auto">
                Take a closer look at our farm operations, sustainable
                practices, and the journey from farm to table.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/public/gallery" className="btn-secondary">
                View All Videos & Images
              </Link>
            </div>
          </div>
        </section>
      )}

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
          {loadingStates.products ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-secondary-600">Loading products...</p>
            </div>
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
                <Link to="/public/products" className="btn-primary">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayFeatures.map((feature, index) => (
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

      {/* Location & Map */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">
              Visit Our Farm
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Located in Rongai, Kenya, we're easily accessible and ready to
              serve you with the freshest produce.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-start space-x-4 mb-6">
                <FaMapMarkerAlt className="text-primary-600 text-2xl mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                    Gicheha Farm Rongai
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {abouts
                      .filter(
                        (about) => about.section === "history" && about.isActive
                      )
                      .map((about) => about.content)
                      .join(" ") ||
                      "Our farm is situated in the heart of Rongai, providing easy access to fresh, organic produce. We pride ourselves on sustainable farming practices that benefit both our community and the environment."}
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold text-secondary-800 mb-3">
                  Farm Details
                </h4>
                <div className="space-y-2 text-secondary-600">
                  <p>
                    <strong>Location:</strong> Rongai, Kenya
                  </p>
                  <p>
                    <strong>Specialty:</strong> Eggs, Livestock & Organic
                    Vegetables
                  </p>
                  <p>
                    <strong>Established:</strong> 20+ Years of Excellence
                  </p>
                  <p>
                    <strong>Commitment:</strong> Sustainable & Quality Farming
                  </p>
                </div>
              </div>
            </div>
            <div className="h-96 rounded-lg overflow-hidden shadow-lg">
              <LoadScript
                googleMapsApiKey={
                  process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
                  "YOUR_GOOGLE_MAPS_API_KEY"
                }
              >
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={{
                    lat: -1.3958, // Approximate coordinates for Rongai, Kenya
                    lng: 36.7439,
                  }}
                  zoom={14}
                >
                  <Marker
                    position={{
                      lat: -1.3958,
                      lng: 36.7439,
                    }}
                    title="Gicheha Farm Rongai"
                  />
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {team.length > 0 && (
        <section className="py-16 bg-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-4">
                Meet Our Team
              </h2>
              <p className="text-secondary-600 max-w-2xl mx-auto">
                Get to know the dedicated professionals behind Gicheha Farm who
                work tirelessly to bring you the freshest produce.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team
                .filter((member) => member.isActive)
                .sort((a, b) => a.order - b.order)
                .map((member) => (
                  <div
                    key={member._id}
                    className="bg-white rounded-lg shadow-md p-6 text-center"
                  >
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600 font-bold text-2xl">
                      {member.initials}
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-primary-600 font-medium mb-3">
                      {member.position}
                    </p>
                    <p className="text-secondary-600 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

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
          {loadingStates.testimonials ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-secondary-600">Loading testimonials...</p>
            </div>
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
                <Link to="/public/testimonials" className="btn-secondary">
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
              to="/public/products"
              className="bg-white text-primary-600 hover:bg-secondary-50 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Start Shopping
            </Link>
            <Link
              to="/public/gallery"
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
