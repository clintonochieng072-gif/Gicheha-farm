import React from "react";
import { FaStar } from "react-icons/fa";

const TestimonialCard = ({ testimonial }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`${
          index < rating ? "text-yellow-400" : "text-secondary-300"
        }`}
        size={16}
      />
    ));
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-4 mb-4">
        {testimonial.image ? (
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-600 font-semibold text-lg">
              {testimonial.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h4 className="font-semibold text-secondary-800">
            {testimonial.name}
          </h4>
          <div className="flex items-center space-x-1">
            {renderStars(testimonial.rating)}
          </div>
        </div>
      </div>

      <blockquote className="text-secondary-600 italic">
        "{testimonial.message}"
      </blockquote>
    </div>
  );
};

export default TestimonialCard;
