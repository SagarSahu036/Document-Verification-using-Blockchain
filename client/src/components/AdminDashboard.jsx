import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Upload,
  FileText,
  Settings,
  LogOut,
  Shield,
  Users,
  Database,
  Activity,
  Clock,
  CheckCircle,
  Home,
  XCircle,
  Power,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    issuedToday: 0,
    revokedDocuments: 0,
    activeDocuments: 0,
    inactiveDocuments: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch real data from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("❌ No authentication token found");
          navigate("/admin/login");
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/api/documents/dashboard-stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("❌ Failed to load dashboard stats:", err.message);

        // If 401 (unauthorized), redirect to login
        if (err.response?.status === 401) {
          console.error("❌ Unauthorized - Please login again");
          localStorage.removeItem("token");
          localStorage.removeItem("adminName");
          navigate("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleNavigation = (page) => {
    if (page === "document-actions") {
      navigate("/admin/control-panel");
    } else if (page === "document-management") {
      navigate("/admin/document-history");
    } else if (page === "issue-document") {
      navigate("/admin/issue-document");
    } else {
      alert(`Navigating to ${page} page...`);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("adminName");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const menuItems = [
    {
      id: "issue",
      title: "Issue Document",
      description: "Upload and issue new documents to the blockchain",
      icon: Upload,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/20",
      hoverBorder: "hover:border-blue-500/50",
      page: "issue-document",
    },
    {
      id: "management",
      title: "Document Management",
      description:
        "View, search, and manage all issued documents on blockchain",
      icon: Database,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/20",
      hoverBorder: "hover:border-purple-500/50",
      page: "document-management",
    },
    {
      id: "actions",
      title: "Actions on Documents",
      description: "Revoke, update, or perform actions on documents",
      icon: Settings,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/20",
      hoverBorder: "hover:border-amber-500/50",
      page: "document-actions",
    },
  ];

  const statisticsCards = [
    {
      label: "Total Documents",
      value: stats.totalDocuments,
      icon: FileText,
      color: "blue",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      textColor: "text-blue-300",
    },
    {
      label: "Issued Today",
      value: stats.issuedToday,
      icon: CheckCircle,
      color: "green",
      bgGradient: "from-green-500/20 to-emerald-500/20",
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
      textColor: "text-green-300",
    },
    {
      label: "Active Documents",
      value: stats.activeDocuments,
      icon: Power,
      color: "emerald",
      bgGradient: "from-emerald-500/20 to-teal-500/20",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      textColor: "text-emerald-300",
    },
    {
      label: "Revoked Documents",
      value: stats.revokedDocuments,
      icon: XCircle,
      color: "amber",
      bgGradient: "from-amber-500/20 to-orange-500/20",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      textColor: "text-amber-300",
    },
    {
      label: "Inactive Documents",
      value: stats.inactiveDocuments,
      icon: Clock,
      color: "gray",
      bgGradient: "from-gray-500/20 to-slate-500/20",
      iconBg: "bg-gray-500/20",
      iconColor: "text-gray-400",
      textColor: "text-gray-300",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "purple",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      textColor: "text-purple-300",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Manage your blockchain document system
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Home Button */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center px-4 md:px-6 py-3 bg-slate-800/50 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-500/50 rounded-xl transition-all duration-300"
              title="Go to Home Page"
            >
              <Home className="w-5 h-5 mr-2" />
              <span className="hidden md:inline">Home</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-4 md:px-6 py-3 bg-slate-800/50 hover:bg-red-500/20 border border-slate-700/50 hover:border-red-500/50 rounded-xl transition-all duration-300"
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-slate-700/50 animate-pulse"
              >
                <div className="w-10 h-10 bg-slate-700 rounded-xl mb-4"></div>
                <div className="h-8 bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {statisticsCards.map((stat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-bold mb-1">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Main Menu Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-3 text-amber-400" />
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNavigation(item.page)}
                onMouseEnter={() => setSelectedCard(item.id)}
                onMouseLeave={() => setSelectedCard(null)}
                className={`bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 ${
                  item.hoverBorder
                } cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  selectedCard === item.id ? "shadow-2xl" : ""
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                    item.bgColor
                  } transition-all duration-300 ${
                    selectedCard === item.id ? "scale-110" : ""
                  }`}
                >
                  <item.icon className="w-8 h-8 text-white" />
                </div>

                <h3
                  className={`text-2xl font-bold mb-3 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                >
                  {item.title}
                </h3>

                <p className="text-gray-400 mb-6">{item.description}</p>

                <button
                  className={`w-full py-3 bg-gradient-to-r ${item.color} rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
                >
                  Access Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50 mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-3 text-blue-400" />
            System Overview
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Active vs Inactive Chart */}
            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">
                Document Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-400">Active Documents</span>
                  </div>
                  <span className="text-white font-semibold">
                    {stats.activeDocuments}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-3"></div>
                    <span className="text-gray-400">Revoked Documents</span>
                  </div>
                  <span className="text-white font-semibold">
                    {stats.revokedDocuments}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                    <span className="text-gray-400">Inactive Documents</span>
                  </div>
                  <span className="text-white font-semibold">
                    {stats.inactiveDocuments}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">
                Today's Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-gray-400">Documents Issued</span>
                  </div>
                  <span className="text-white font-semibold text-xl">
                    {stats.issuedToday}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-purple-400 mr-3" />
                    <span className="text-gray-400">Total Users</span>
                  </div>
                  <span className="text-white font-semibold text-xl">
                    {stats.totalUsers}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center text-sm text-gray-500">
            <Shield className="w-4 h-4 mr-2" />
            <span>System secured with blockchain technology</span>
          </div>
        </div>
      </div>
    </div>
  );
}
