import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Shield,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  Hash,
  Clock,
  AlertTriangle,
  Building,
} from "lucide-react";

const QRCodeVerifier = () => {
  const { hash } = useParams();
  const [loading, setLoading] = useState(true);
  const [blockchainData, setBlockchainData] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://192.168.0.4:5000/api/documents/verify/${hash}`
        );

        // Assuming your API returns both blockchain and MongoDB data
        // Adjust based on your actual API response structure
        setBlockchainData(res.data.blockchain);
        setDocumentData(res.data.document);
      } catch (err) {
        setError("Verification failed. Document not found or invalid.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hash]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4 animate-pulse">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">
            Verifying document on blockchain...
          </p>
          <p className="text-gray-400 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-red-500/50">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-4">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-3">
              Verification Failed
            </h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format timestamp
  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === 0) return "Lifetime";
    return new Date(timestamp * 1000).toLocaleString();
  };

  const isActive = blockchainData?.active;
  const isRevoked = blockchainData?.revokedAt > 0;
  const isExpired =
    blockchainData?.expiresAt > 0 &&
    blockchainData?.expiresAt < Date.now() / 1000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header with Status */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 shadow-2xl ${
              isActive && !isRevoked && !isExpired
                ? "bg-gradient-to-br from-green-500 to-emerald-500"
                : "bg-gradient-to-br from-red-500 to-rose-500"
            }`}
          >
            {isActive && !isRevoked && !isExpired ? (
              <CheckCircle className="w-12 h-12" />
            ) : (
              <XCircle className="w-12 h-12" />
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {isActive && !isRevoked && !isExpired ? (
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Document Verified ✓
              </span>
            ) : (
              <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                Document Invalid
              </span>
            )}
          </h1>

          <p className="text-gray-400 text-lg">
            {isRevoked
              ? "This document has been revoked"
              : isExpired
              ? "This document has expired"
              : !isActive
              ? "This document is not active"
              : "This document is authentic and verified on blockchain"}
          </p>
        </div>

        {/* Main Certificate Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50 mb-6">
          {/* Document Header */}
          <div className="border-b border-slate-700 pb-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <FileText className="w-6 h-6 mr-3 text-blue-400" />
                {documentData?.documentType || "Document Certificate"}
              </h2>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  isActive && !isRevoked && !isExpired
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {isRevoked
                  ? "Revoked"
                  : isExpired
                  ? "Expired"
                  : documentData?.status || "Active"}
              </span>
            </div>
          </div>

          {/* Personal Details Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-purple-400">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-400">Full Name</p>
                </div>
                <p className="text-lg font-semibold">
                  {documentData?.primaryName || "N/A"}
                </p>
              </div>

              {documentData?.email && (
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-400">Email Address</p>
                  </div>
                  <p className="text-lg font-semibold break-all">
                    {documentData.email}
                  </p>
                </div>
              )}

              {documentData?.mobile && (
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-400">Mobile Number</p>
                  </div>
                  <p className="text-lg font-semibold">{documentData.mobile}</p>
                </div>
              )}

              {documentData?.uploadDate && (
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-400">Issue Date</p>
                  </div>
                  <p className="text-lg font-semibold">
                    {documentData.uploadDate}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Blockchain Details Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-400">
              <Shield className="w-5 h-5 mr-2" />
              Blockchain Verification
            </h3>
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Hash className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-400">Document Hash</p>
                </div>
                <p className="font-mono text-xs break-all text-blue-300">
                  {blockchainData?.hash}
                </p>
              </div>

              {documentData?.transactionHash && (
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Hash className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-400">Transaction Hash</p>
                  </div>
                  <p className="font-mono text-xs break-all text-blue-300">
                    {documentData.transactionHash}
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Building className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-400">Issued By</p>
                  </div>
                  <p className="text-lg font-semibold">
                    {blockchainData?.issuerName || "System Admin"}
                  </p>
                  <p className="font-mono text-xs text-gray-500 mt-1 break-all">
                    {blockchainData?.issuer}
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-400">
                      Issued On Blockchain
                    </p>
                  </div>
                  <p className="text-lg font-semibold">
                    {formatDate(blockchainData?.issuedAt)}
                  </p>
                </div>

                {blockchainData?.expiresAt > 0 && (
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-400">Expires At</p>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatDate(blockchainData.expiresAt)}
                    </p>
                  </div>
                )}

                {blockchainData?.validityDays !== undefined && (
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-400">Validity Period</p>
                    </div>
                    <p className="text-lg font-semibold">
                      {blockchainData.validityDays === 0
                        ? "Lifetime"
                        : `${blockchainData.validityDays} days`}
                    </p>
                  </div>
                )}
              </div>

              {isRevoked && blockchainData?.revokedAt > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
                    <div>
                      <p className="text-sm text-red-400 font-semibold">
                        This document has been revoked
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Revoked on: {formatDate(blockchainData.revokedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Verification Badge */}
          <div
            className={`text-center p-6 rounded-2xl ${
              isActive && !isRevoked && !isExpired
                ? "bg-green-500/10 border border-green-500/30"
                : "bg-red-500/10 border border-red-500/30"
            }`}
          >
            <Shield
              className={`w-8 h-8 mx-auto mb-2 ${
                isActive && !isRevoked && !isExpired
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            />
            <p
              className={`text-sm font-semibold ${
                isActive && !isRevoked && !isExpired
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {isActive && !isRevoked && !isExpired
                ? "✓ This certificate is verified and secured on the blockchain"
                : "✗ This certificate is not valid"}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Verification powered by blockchain technology
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            © 2025 BITS University | Blockchain Document Verification System
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeVerifier;
