import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaLeaf, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { getTotalItems } = useCart();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Gallery", href: "/gallery" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/api/logo" // Will be replaced with actual logo endpoint
              alt="Gicheha Farm Logo"
              className="h-10 w-auto"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "flex";
              }}
            />
            <div
              className="flex items-center space-x-2"
              style={{ display: "none" }}
            >
              <FaLeaf className="text-primary-600 text-2xl" />
              <span className="text-xl font-bold text-secondary-800">
                Gicheha Farm Rongai
              </span>
            </div>
          </Link>

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
            {/* Cart Icon */}
            <Link
              to="/cart"
              className={`${
                isActive("/cart")
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
          </nav>

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
                to="/cart"
                className={`${
                  isActive("/cart")
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
