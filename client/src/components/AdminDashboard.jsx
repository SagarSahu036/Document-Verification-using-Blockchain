import React, { useState } from "react";
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
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();

  const handleNavigation = (page) => {
    if (page === "document-actions") {
      navigate("/admin/control-panel");
    } else if (page === "document-management") {
      navigate("/admin/document-history");
    } else if (page === "issue-document") {
      // 👈 NEW
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

      // Redirect to login page
      navigate("/");
    }
  };

  // Mock statistics
  const stats = [
    { label: "Total Documents", value: "1,234", icon: FileText, color: "blue" },
    { label: "Issued Today", value: "47", icon: CheckCircle, color: "green" },
    { label: "Pending Actions", value: "12", icon: Clock, color: "amber" },
    { label: "Active Users", value: "89", icon: Users, color: "purple" },
  ];

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
            {/* Home Button - Add this */}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    stat.color === "blue"
                      ? "bg-blue-500/20"
                      : stat.color === "green"
                      ? "bg-green-500/20"
                      : stat.color === "amber"
                      ? "bg-amber-500/20"
                      : "bg-purple-500/20"
                  }`}
                >
                  <stat.icon
                    className={`w-5 h-5 ${
                      stat.color === "blue"
                        ? "text-blue-400"
                        : stat.color === "green"
                        ? "text-green-400"
                        : stat.color === "amber"
                        ? "text-amber-400"
                        : "text-purple-400"
                    }`}
                  />
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold mb-1">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

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
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-3 text-blue-400" />
            Recent Activity
          </h2>

          <div className="space-y-4">
            {[
              {
                action: "Document issued",
                file: "certificate_2024.pdf",
                time: "5 minutes ago",
                status: "success",
              },
              {
                action: "Document verified",
                file: "diploma_john_doe.pdf",
                time: "15 minutes ago",
                status: "info",
              },
              {
                action: "Document revoked",
                file: "old_license.pdf",
                time: "1 hour ago",
                status: "warning",
              },
              {
                action: "New user registered",
                file: "user_id_45",
                time: "2 hours ago",
                status: "info",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900/70 transition-all duration-300"
              >
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-4 ${
                      activity.status === "success"
                        ? "bg-green-400"
                        : activity.status === "warning"
                        ? "bg-amber-400"
                        : "bg-blue-400"
                    }`}
                  ></div>
                  <div>
                    <p className="font-semibold">{activity.action}</p>
                    <p className="text-sm text-gray-400">{activity.file}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            ))}
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
