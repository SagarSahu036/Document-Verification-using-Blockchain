// src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UploadZone from "./components/UploadZone";
import IssuePage from "./components/issuePage";
import QRCodeVerifier from "./components/QRCodeVerifier";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminControlPanel from "./components/AdminControlPanel";

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

        {/* Main Content - Different per route */}
        <main className="container mx-auto px-6 py-12">
          <Routes>
            {/* === VERIFY PAGE (Full layout with left side) === */}
            <Route
              path="/"
              element={
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Side - Info */}
                    <div className="pl-8 lg:pl-16 space-y-8">
                      <div className="text-center lg:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold">
                          An easy way to check and verify your documents
                        </h2>
                        <p className="text-gray-400 mt-4">
                          Whether you are a student or an employer, verify any
                          document here.
                        </p>
                      </div>

                      {/* Drag Me Demo Certificate */}
                      <div className="hidden lg:block">
                        <div className="flex items-center space-x-6">
                          <div
                            className="w-32 animate-pulse cursor-grab hover:scale-105 transition-transform"
                            draggable="true"
                            onDragStart={(e) =>
                              e.dataTransfer.setData("text/plain", "demo")
                            }
                          >
                            <img
                              src="https://www.opencerts.io/static/images/dropzone/cert.png"
                              alt="Draggable demo certificate"
                              className="w-full drop-shadow-md"
                            />
                          </div>
                          <div>
                            <img
                              src="https://www.opencerts.io/static/images/dropzone/arrow.png"
                              alt="instructional arrow"
                              className="w-10 mx-auto"
                            />
                            <p className="text-orange-400 text-sm mt-3 leading-tight">
                              Drag me over here to see a demo certificate and
                              other features
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Upload Zone */}
                    <div className="flex items-center justify-center">
                      <UploadZone />
                    </div>
                  </div>
                </>
              }
            />

            {/* === ISSUE PAGE (Clean form only) === */}
            <Route path="/issue" element={<IssuePage />} />
            <Route path="/verify/:hash" element={<QRCodeVerifier />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/control-panel"
              element={<AdminControlPanel />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
