import React, { useState, useEffect } from "react";
import { FaLeaf, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import SocialMediaIcons from "./SocialMediaIcons";

const Footer = () => {
  const [socialMedia, setSocialMedia] = useState([]);

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  const fetchSocialMedia = async () => {
    try {
      const response = await axios.get("/api/social-media");
      setSocialMedia(response.data);
    } catch (error) {
      console.error("Error fetching social media:", error);
    }
  };

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FaLeaf className="text-primary-400 text-2xl" />
              <span className="text-xl font-bold">Gicheha Farm Rongai</span>
            </div>
            <p className="text-secondary-300 mb-4">
              Delivering fresh, organic farm products straight from our fields
              to your table. Quality and sustainability are at the heart of
              everything we do.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-primary-400" />
                <span className="text-sm">Rongai, Kenya</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaPhone className="text-primary-400" />
                <span className="text-sm">+254 786 855 690</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-primary-400" />
                <span className="text-sm">info@gichehafarm.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/public"
                  className="text-secondary-300 hover:text-primary-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/public/about"
                  className="text-secondary-300 hover:text-primary-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/public/products"
                  className="text-secondary-300 hover:text-primary-400 transition-colors"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/public/testimonials"
                  className="text-secondary-300 hover:text-primary-400 transition-colors"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="/public/gallery"
                  className="text-secondary-300 hover:text-primary-400 transition-colors"
                >
                  Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <SocialMediaIcons socialMedia={socialMedia} className="mb-4" />
            <p className="text-secondary-300 mb-4 text-sm">
              Subscribe to our newsletter for the latest updates and seasonal
              offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-secondary-900 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-r-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-700 mt-8 pt-8 text-center">
          <p className="text-secondary-400 text-sm">
            © {new Date().getFullYear()} Gicheha Farm Rongai. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
