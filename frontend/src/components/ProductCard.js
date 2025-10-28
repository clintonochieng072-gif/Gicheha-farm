import React, { useState } from "react";
import { FaShoppingCart, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductCard = ({ product, onAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["https://via.placeholder.com/300x200?text=No+Image"];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="card group hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={images[currentImageIndex]}
          alt={product.name || "Product"}
          className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300 bg-gray-50"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-opacity"
            >
              <FaChevronLeft size={12} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-opacity"
            >
              <FaChevronRight size={12} />
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex
                      ? "bg-white"
                      : "bg-white bg-opacity-50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              product.inStock
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-secondary-800 mb-2">
          {product.name || "Unnamed Product"}
        </h3>
        <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
          {product.description || "No description available"}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary-600">
            KSh {product.price || "0"}
          </span>
          <span className="text-sm text-secondary-500">
            per {product.unit || "unit"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-secondary-600 capitalize">
            {product.category && product.category !== ""
              ? product.category
              : "Uncategorized"}
          </span>
          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            className={`btn-primary flex items-center space-x-2 ${
              !product.inStock ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!product.inStock}
          >
            <FaShoppingCart size={14} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
