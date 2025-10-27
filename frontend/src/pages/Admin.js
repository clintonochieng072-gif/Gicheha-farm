import React, { useState, useEffect } from "react";
import AdminLogin from "../components/AdminLogin";
import AdminDashboard from "../components/AdminDashboard";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    // Check if admin is already logged in
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {isLoggedIn ? (
        <AdminDashboard token={token} onLogout={handleLogout} />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <AdminLogin onLogin={handleLogin} />
        </div>
      )}
    </div>
  );
};

export default Admin;
