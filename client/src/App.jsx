// src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UploadZone from "./components/UploadZone";
import IssuePage from "./components/issuePage";
import QRCodeVerifier from "./components/QRCodeVerifier";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminControlPanel from "./components/AdminControlPanel";
import DocumentHistory from "./components/DocumentHistory";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header - Same for both pages */}
        <header className="py-4 px-8 border-b border-gray-800 bg-black/50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-blue-400">
              🔐 Blockchain Document Verifier
            </h1>
            <nav className="space-x-6 text-sm">
              <Link to="/" className="text-gray-400 hover:text-white">
                Verify
              </Link>
              <Link to="/issue" className="text-gray-400 hover:text-white">
                Issue
              </Link>
              <Link
                to="/admin/login"
                className="text-gray-400 hover:text-white"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>

        <Routes>
          {/* === VERIFY PAGE (Full layout with left side) === */}
          <Route path="/" element={<UploadZone />} />
          {/* === ISSUE PAGE (Clean form only) === */}
          <Route path="/issue" element={<IssuePage />} />
          <Route path="/verify/:hash" element={<QRCodeVerifier />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/control-panel" element={<AdminControlPanel />} />
          <Route path="/admin/document-history" element={<DocumentHistory />} />
          <Route path="/admin/issue-document" element={<IssuePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
