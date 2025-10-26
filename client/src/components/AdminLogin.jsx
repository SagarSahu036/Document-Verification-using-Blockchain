// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });

      // Save token and name
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("adminName", res.data.name);

      setMessage("✅ Login successful!");
      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 ">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl mb-50">
        <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center ">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition"
          >
            Login
          </button>

          {message && (
            <p
              className={`text-center text-sm mt-2 ${
                message.includes("success") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <p className="text-gray-400 text-xs text-center mt-6">
          © 2025 BITS University | Admin Portal
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
