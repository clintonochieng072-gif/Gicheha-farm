import React, { useState } from "react";
import api from "../utils/api";

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/admin/login", credentials);
      const { accessToken } = response.data;

      // Store access token in memory (not localStorage for security)
      localStorage.setItem("accessToken", accessToken);
      onLogin(accessToken);
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage("");

    try {
      await api.post("/admin/forgot-password", { email: forgotEmail });
      setForgotMessage(
        "If an account with that email exists, a password reset link has been sent."
      );
    } catch (error) {
      setForgotMessage("Failed to send reset email. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      {!showForgotPassword ? (
        <>
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary mb-4"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <button
            onClick={() => setShowForgotPassword(true)}
            className="w-full text-primary-600 hover:text-primary-800 text-sm underline"
          >
            Forgot Password?
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-center mb-6">
            Reset Password
          </h2>

          {forgotMessage && (
            <div
              className={`px-4 py-3 rounded mb-4 ${
                forgotMessage.includes("sent")
                  ? "bg-green-100 border border-green-400 text-green-700"
                  : "bg-red-100 border border-red-400 text-red-700"
              }`}
            >
              {forgotMessage}
            </div>
          )}

          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <label
                htmlFor="forgotEmail"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="forgotEmail"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary mb-4"
              disabled={forgotLoading}
            >
              {forgotLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <button
            onClick={() => {
              setShowForgotPassword(false);
              setForgotMessage("");
              setForgotEmail("");
            }}
            className="w-full text-primary-600 hover:text-primary-800 text-sm underline"
          >
            Back to Login
          </button>
        </>
      )}
    </div>
  );
};

export default AdminLogin;
