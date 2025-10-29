import React, { useState } from "react";
import api from "../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/admin/forgot-password", { email });
      setMessage(
        "If an account with that email exists, a password reset link has been sent."
      );
    } catch (error) {
      setMessage("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

      {message && (
        <div
          className={`px-4 py-3 rounded mb-4 ${
            message.includes("sent")
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-secondary-700 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="Enter your email"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full btn-primary mb-4"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <button
        onClick={() => window.history.back()}
        className="w-full text-primary-600 hover:text-primary-800 text-sm underline"
      >
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPassword;
