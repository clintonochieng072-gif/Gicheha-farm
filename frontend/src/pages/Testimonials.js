import React, { useState, useEffect } from "react";
import axios from "axios";
import TestimonialCard from "../components/TestimonialCard";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get("/api/testimonials");
      setTestimonials(response.data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage("");

    try {
      await axios.post("/api/testimonials", formData);
      setSubmitMessage(
        "Thank you for your testimonial! It will be reviewed before being published."
      );
      setFormData({ name: "", message: "", rating: 5 });
      // Note: We don't fetch testimonials again since new ones need approval
    } catch (error) {
      setSubmitMessage("Error submitting testimonial. Please try again.");
      console.error("Error submitting testimonial:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((sum, t) => sum + t.rating, 0) /
          testimonials.length
        ).toFixed(1)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary-800 mb-4">
          Customer Testimonials
        </h1>
        <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
          Hear what our satisfied customers have to say about our fresh, organic
          products.
        </p>
        {testimonials.length > 0 && (
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center space-x-2 bg-primary-50 px-4 py-2 rounded-lg">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < Math.floor(averageRating)
                        ? "text-yellow-400"
                        : "text-secondary-300"
                    }`}
                    size={16}
                  />
                ))}
              </div>
              <span className="font-semibold text-secondary-800">
                {averageRating}
              </span>
              <span className="text-secondary-600">
                ({testimonials.length} reviews)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Testimonials Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-secondary-600">Loading testimonials...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-secondary-600 text-lg">
            No testimonials yet. Be the first to share your experience!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial._id} testimonial={testimonial} />
          ))}
        </div>
      )}

      {/* Submit Testimonial Form */}
      <div className="bg-secondary-50 rounded-lg p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <FaQuoteLeft className="text-primary-600 text-4xl mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">
              Share Your Experience
            </h2>
            <p className="text-secondary-600">
              We'd love to hear about your experience with Gicheha Farm
              products. Your feedback helps us improve and helps other customers
              make informed decisions.
            </p>
          </div>

          {submitMessage && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                submitMessage.includes("Error")
                  ? "bg-red-100 text-red-700 border border-red-400"
                  : "bg-green-100 text-green-700 border border-green-400"
              }`}
            >
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
                required
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Rating *
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none"
                  >
                    <FaStar
                      className={`${
                        star <= formData.rating
                          ? "text-yellow-400"
                          : "text-secondary-300"
                      } hover:text-yellow-400 transition-colors`}
                      size={24}
                    />
                  </button>
                ))}
                <span className="ml-2 text-secondary-600">
                  ({formData.rating} star{formData.rating !== 1 ? "s" : ""})
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Your Testimonial *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="input-field resize-none"
                required
                placeholder="Tell us about your experience with our products..."
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn-primary px-8 py-3"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Testimonial"}
              </button>
            </div>
          </form>

          <p className="text-sm text-secondary-500 text-center mt-4">
            * Your testimonial will be reviewed before being published on our
            website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
