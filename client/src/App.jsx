// src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UploadZone from "./components/UploadZone";
import IssuePage from "./components/issuePage";
import QRCodeVerifier from "./components/QRCodeVerifier";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminControlPanel from "./components/AdminControlPanel";
import DocumentHistory from "./components/DocumentHistory";
import LandingPage from "./components/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          {/* === PUBLIC ROUTES (no auth required) === */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/verify" element={<UploadZone />} />{" "}
          {/* Public verify page */}
          <Route path="/verify/:hash" element={<QRCodeVerifier />} />{" "}
          {/* Public issue? Or admin-only? */}
          {/* === AUTH ROUTES === */}
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* === PROTECTED ADMIN ROUTES === */}
          <Route
            path="/issue"
            element={
              <ProtectedRoute>
                <IssuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/control-panel"
            element={
              <ProtectedRoute>
                <AdminControlPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/document-history"
            element={
              <ProtectedRoute>
                <DocumentHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/issue-document"
            element={
              <ProtectedRoute>
                <IssuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/login"
            element={
              <GuestRoute>
                <AdminLogin />
              </GuestRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
