import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaLeaf, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import SocialMediaIcons from "./SocialMediaIcons";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logo, setLogo] = useState(null);
  const [socialMedia, setSocialMedia] = useState([]);
  const location = useLocation();
  const { getTotalItems } = useCart();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch(
          `${
            process.env.REACT_APP_API_URL ||
            "https://gicheha-farm.onrender.com/api"
          }/logos/active`
        );
        if (response.ok) {
          const logoData = await response.json();
          setLogo(logoData);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    const fetchSocialMedia = async () => {
      try {
        const response = await fetch(
          `${
            process.env.REACT_APP_API_URL ||
            "https://gicheha-farm.onrender.com/api"
          }/social-media`
        );
        if (response.ok) {
          const socialMediaData = await response.json();
          setSocialMedia(socialMediaData);
        }
      } catch (error) {
        console.error("Error fetching social media:", error);
      }
    };

    fetchLogo();
    fetchSocialMedia();
  }, []);

  const navigation = [
    { name: "Home", href: "/public" },
    { name: "About", href: "/public/about" },
    { name: "Products", href: "/public/products" },
    { name: "Testimonials", href: "/public/testimonials" },
    { name: "Gallery", href: "/public/gallery" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Social Media Icons at the top */}
        {socialMedia.length > 0 && (
          <div className="flex justify-center py-2 border-b border-secondary-200">
            <SocialMediaIcons
              socialMedia={socialMedia}
              className="justify-center"
              iconSize="h-5 w-5"
            />
          </div>
        )}

        <div className="flex justify-between items-center h-28">
          {/* Left side - empty for balance */}
          <div className="flex-1"></div>

          {/* Center - Logo */}
          <div className="flex-1 flex justify-center">
            <Link to="/public" className="flex items-center">
              {logo ? (
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="h-24 w-auto max-w-[500px] object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="flex items-center space-x-2"
                style={{ display: logo ? "none" : "flex" }}
              >
                <FaLeaf className="text-primary-600 text-2xl" />
                <span className="text-xl font-bold text-secondary-800">
                  Gicheha Farm Rongai
                </span>
              </div>
            </Link>
          </div>

          {/* Right side - Navigation and Cart */}
          <div className="flex-1 flex justify-end items-center space-x-8">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-secondary-600 hover:text-primary-600"
                  } px-3 py-2 text-sm font-medium transition-colors duration-200`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Cart Icon */}
            <Link
              to="/public/cart"
              className={`${
                isActive("/public/cart")
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-secondary-600 hover:text-primary-600"
              } px-3 py-2 text-sm font-medium transition-colors duration-200 relative`}
            >
              <FaShoppingCart size={16} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-secondary-600 hover:text-primary-600 p-2"
              >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? "text-primary-600 bg-primary-50"
                      : "text-secondary-600 hover:text-primary-600 hover:bg-primary-50"
                  } block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {/* Mobile Cart Link */}
              <Link
                to="/public/cart"
                className={`${
                  isActive("/public/cart")
                    ? "text-primary-600 bg-primary-50"
                    : "text-secondary-600 hover:text-primary-600 hover:bg-primary-50"
                } block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 flex items-center justify-between`}
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center space-x-2">
                  <FaShoppingCart size={16} />
                  <span>Cart</span>
                </span>
                {getTotalItems() > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
