import React from "react";

const GalleryCard = ({ image }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <img
        src={image.image}
        alt={image.title}
        className="w-full h-48 sm:h-56 md:h-64 object-contain group-hover:scale-105 transition-transform duration-300 bg-gray-50"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
        <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {image.title && (
            <h3 className="text-lg font-semibold mb-2">{image.title}</h3>
          )}
          {image.description && <p className="text-sm">{image.description}</p>}
        </div>
      </div>
      {image.category && (
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 text-xs font-medium rounded bg-primary-600 text-white capitalize">
            {image.category}
          </span>
        </div>
      )}
    </div>
  );
};

export default GalleryCard;
