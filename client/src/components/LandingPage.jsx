import React from "react";
import {
  Shield,
  CheckCircle,
  Lock,
  FileText,
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  Search,
  Upload,
  Verified,
} from "lucide-react";

export default function LandingPage() {
  const handleAdminLogin = () => {
    // Navigate to admin login
    console.log("Navigate to admin login");
  };

  const handleVerifyDocument = () => {
    // Navigate to verify page
    console.log("Navigate to verify document page");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">DocVerify</h1>
                <p className="text-xs text-purple-300">
                  Blockchain Document Verification
                </p>
              </div>
            </div>
            <button
              onClick={handleAdminLogin}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              Admin Login
            </button>
          </nav>

          {/* Hero Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-8">
              <Verified className="w-4 h-4 text-green-400" />
              <span className="text-sm text-white font-medium">
                Powered by Blockchain Technology
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Secure Document
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Verification System
              </span>
            </h1>

            <p className="text-xl text-purple-200 mb-12 max-w-3xl mx-auto">
              Issue, verify, and manage tamper-proof digital certificates and
              documents on the blockchain. Ensure authenticity with
              cryptographic security.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleVerifyDocument}
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-2xl hover:shadow-purple-500/50 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Verify Document
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleAdminLogin}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Admin Dashboard
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <p className="text-purple-300 text-sm mb-2">Documents Verified</p>
              <p className="text-4xl font-bold text-white">10,000+</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <p className="text-purple-300 text-sm mb-2">
                Blockchain Transactions
              </p>
              <p className="text-4xl font-bold text-white">8,500+</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <p className="text-purple-300 text-sm mb-2">
                Active Organizations
              </p>
              <p className="text-4xl font-bold text-white">150+</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-transparent to-slate-900/50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose DocVerify?
            </h2>
            <p className="text-xl text-purple-300">
              Unmatched security and transparency for your documents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Tamper-Proof
              </h3>
              <p className="text-purple-200">
                Documents are cryptographically secured on the blockchain,
                making them impossible to alter or forge.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Instant Verification
              </h3>
              <p className="text-purple-200">
                Verify any document in seconds using its unique hash. No manual
                processes required.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Transparent Audit Trail
              </h3>
              <p className="text-purple-200">
                Every transaction is permanently recorded on the blockchain for
                complete transparency.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Lightning Fast
              </h3>
              <p className="text-purple-200">
                Issue and verify documents instantly with our optimized
                blockchain infrastructure.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Multi-Organization
              </h3>
              <p className="text-purple-200">
                Perfect for universities, companies, government agencies, and
                more.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-6">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Any Document Type
              </h3>
              <p className="text-purple-200">
                Certificates, degrees, land records, contracts, and more. All
                supported.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-purple-300">Simple 3-step process</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Upload Document
                </h3>
                <p className="text-purple-200">
                  Admin uploads the document (PDF) with recipient details and
                  validity period.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Blockchain Storage
                </h3>
                <p className="text-purple-200">
                  System generates a unique hash and stores it permanently on
                  the blockchain.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Instant Verification
                </h3>
                <p className="text-purple-200">
                  Anyone can verify the document authenticity using the QR code
                  or hash.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join hundreds of organizations already using blockchain for
              document verification
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleVerifyDocument}
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Verify a Document
              </button>
              <button
                onClick={handleAdminLogin}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all border-2 border-white flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Issue Documents
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-purple-300">
            © 2025 DocVerify. Powered by Blockchain Technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
