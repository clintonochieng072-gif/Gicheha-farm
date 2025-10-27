import React from "react";
import { FaLeaf, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
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
                  href="/"
                  className="text-secondary-300 hover:text-primary-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-secondary-300 hover:text-primary-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="text-secondary-300 hover:text-primary-400 transition-colors"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/testimonials"
                  className="text-secondary-300 hover:text-primary-400 transition-colors"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
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
            <div className="flex space-x-4 mb-4">
              <a
                href="#"
                className="text-secondary-300 hover:text-primary-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-secondary-300 hover:text-primary-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C8.396 0 7.609.034 6.298.154 4.985.275 4.043.588 3.227.998c-.843.426-1.558 1.14-1.984 1.983C.588 4.797.275 5.74.154 7.052.034 8.363 0 9.15 0 12.767s.034 4.404.154 5.715c.121 1.312.434 2.255.854 3.07.426.844 1.14 1.558 1.983 1.984.816.41 1.759.723 3.071.854 1.311.131 2.098.165 5.715.165s4.404-.034 5.715-.165c1.312-.131 2.255-.444 3.071-.854.844-.426 1.558-1.14 1.984-1.983.41-.816.723-1.759.854-3.071.131-1.311.165-2.098.165-5.715s-.034-4.404-.165-5.715c-.131-1.312-.444-2.255-.854-3.071-.426-.844-1.14-1.558-1.983-1.984C19.203.588 18.26.275 17.948.154 16.637.034 15.85 0 12.233 0h-.216zm0 2.296c3.554 0 3.977.013 5.384.093 1.291.076 1.985.27 2.443.45.545.215.94.472 1.35.882.41.41.667.805.882 1.35.18.458.374 1.152.45 2.443.08 1.407.093 1.83.093 5.384s-.013 3.977-.093 5.384c-.076 1.291-.27 1.985-.45 2.443-.215.545-.472.94-.882 1.35-.41.41-.805.667-1.35.882-.458.18-1.152.374-2.443.45-1.407.08-1.83.093-5.384.093s-3.977-.013-5.384-.093c-1.291-.076-1.985-.27-2.443-.45-.545-.215-.94-.472-1.35-.882-.41-.41-.667-.805-.882-1.35-.18-.458-.374-1.152-.45-2.443-.08-1.407-.093-1.83-.093-5.384s.013-3.977.093-5.384c.076-1.291.27-1.985.45-2.443.215-.545.472-.94.882-1.35.41-.41.805-.667 1.35-.882.458-.18 1.152-.374 2.443-.45 1.407-.08 1.83-.093 5.384-.093zm0 3.707c-3.657 0-6.623 2.966-6.623 6.623s2.966 6.623 6.623 6.623 6.623-2.966 6.623-6.623-2.966-6.623-6.623-6.623zm0 10.89c-2.357 0-4.267-1.91-4.267-4.267s1.91-4.267 4.267-4.267 4.267 1.91 4.267 4.267-1.91 4.267-4.267 4.267zm8.472-11.037c-.85 0-1.538-.688-1.538-1.538s.688-1.538 1.538-1.538 1.538.688 1.538 1.538-.688 1.538-1.538 1.538z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-secondary-300 hover:text-primary-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
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
