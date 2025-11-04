import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  ArrowLeft,
  KeyRound,
} from "lucide-react";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/request-otp-login",
        { email, password }
      );

      if (res.data.success) {
        setIsOtpStep(true);
        setMessage("✅ OTP sent to your registered email");
      }
    } catch (error) {
      setMessage("❌ Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/verify-otp-login",
        { email, otp }
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("adminName", res.data.name);
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => navigate("/admin/dashboard", { replace: true }), 1000);
      } else {
        setMessage("❌ Invalid OTP");
      }
    } catch (error) {
      setMessage("❌ Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl mb-4 shadow-2xl">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <p className="text-gray-400">
            {isOtpStep ? "Enter the OTP to continue" : "Sign in to access admin panel"}
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50">
          <form
            onSubmit={isOtpStep ? handleVerifyOtp : handleRequestOtp}
            className="space-y-6"
          >
            {message && (
              <div
                className={`${
                  message.includes("✅")
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                } border rounded-xl p-4 flex items-start`}
              >
                <AlertCircle
                  className={`w-5 h-5 ${
                    message.includes("✅") ? "text-green-400" : "text-red-400"
                  } mr-3 mt-0.5 flex-shrink-0`}
                />
                <p
                  className={`text-sm ${
                    message.includes("✅") ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {message}
                </p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  disabled={isOtpStep}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-amber-500 transition-colors text-white placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            {!isOtpStep && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:border-amber-500 transition-colors text-white placeholder-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* OTP Field */}
            {isOtpStep && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Enter OTP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-amber-500 transition-colors text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all duration-300"
            >
              {isOtpStep ? (
                <>
                  <KeyRound className="inline w-5 h-5 mr-2" />
                  {loading ? "Verifying..." : "Verify OTP"}
                </>
              ) : (
                <>
                  <Lock className="inline w-5 h-5 mr-2" />
                  {loading ? "Sending OTP..." : "Request OTP"}
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center text-sm text-gray-500 mb-3">
            <Shield className="w-4 h-4 mr-2" />
            <span>Secured with blockchain technology</span>
          </div>
          <p className="text-gray-400 text-xs">
            © 2025 BITS University | Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
