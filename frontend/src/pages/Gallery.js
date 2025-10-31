import React, { useState, useEffect } from "react";
import api from "../utils/api";
import GalleryCard from "../components/GalleryCard";
import VideoCard from "../components/VideoCard";
import { FaImages, FaFilter } from "react-icons/fa";

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "farm", "products", "events", "general"];

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await api.get(`/gallery?t=${Date.now()}`);
      setGallery(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredGallery =
    selectedCategory === "all"
      ? gallery
      : gallery.filter((item) => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <FaImages className="text-primary-600 text-5xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-secondary-800 mb-4">
          Our Gallery
        </h1>
        <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
          Take a visual journey through Gicheha Farm Rongai. See our beautiful
          fields, fresh products, and the people who make it all possible.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === category
                ? "bg-primary-600 text-white"
                : "bg-secondary-100 text-secondary-700 hover:bg-primary-100"
            }`}
          >
            {category === "all"
              ? "All Photos"
              : category.charAt(0).toUpperCase() + category.slice(1)}
            {category !== "all" && (
              <span className="ml-2 text-sm opacity-75">
                ({gallery.filter((item) => item.category === category).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-secondary-600">Loading gallery...</p>
        </div>
      ) : filteredGallery.length === 0 ? (
        <div className="text-center py-12">
          <FaImages className="text-secondary-300 text-6xl mx-auto mb-4" />
          <p className="text-secondary-600 text-lg">
            {selectedCategory === "all"
              ? "No images in the gallery yet."
              : `No images found in the ${selectedCategory} category.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGallery.map((item) =>
            item.type === "video" ? (
              <VideoCard key={item._id} video={item} />
            ) : (
              <GalleryCard key={item._id} image={item} />
            )
          )}
        </div>
      )}

      {/* Gallery Stats */}
      <section className="mt-16 bg-secondary-50 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-800 mb-6">
            Gallery Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-primary-600">
                {gallery.length}
              </div>
              <div className="text-secondary-600">Total Images</div>
            </div>
            {categories.slice(1).map((category) => {
              const count = gallery.filter(
                (item) => item.category === category
              ).length;
              return (
                <div
                  key={category}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="text-2xl font-bold text-primary-600">
                    {count}
                  </div>
                  <div className="text-secondary-600 capitalize">
                    {category}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-16 bg-primary-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Want to See More?</h2>
        <p className="text-xl mb-6 opacity-90">
          Our gallery is constantly updated with new photos. Check back
          regularly to see the latest from our farm!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setSelectedCategory("all")}
            className="bg-white text-primary-600 hover:bg-secondary-50 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View All Images
          </button>
          <a
            href="/about"
            className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Learn About Our Farm
          </a>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
