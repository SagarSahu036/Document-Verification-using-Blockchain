import React, { useState, useEffect } from "react";
import {
  Shield,
  PlayCircle,
  PauseCircle,
  XCircle,
  AlertTriangle,
  Hash,
  CheckCircle,
  Activity,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminControlPanel() {
  const [contractPaused, setContractPaused] = useState(false);
  const [revokeHash, setRevokeHash] = useState("");
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    checkContractStatus();
  }, []);

  const checkContractStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/documents/contract-status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update state with real contract status
      setContractPaused(response.data.paused);
      console.log("Contract status:", response.data.paused);
    } catch (error) {
      console.error("Failed to fetch contract status:", error);
    }
  };

  const handlePauseContract = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token"); // Get token like you do for upload

      const response = await axios.post(
        "http://localhost:5000/api/documents/pause-contract",
        {
          // JSON body, not FormData
          action: contractPaused ? "unpause" : "pause",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // JSON content type
          },
        }
      );

      // Update state on success
      setContractPaused(!contractPaused);
      setActionSuccess(
        contractPaused
          ? "Contract Resumed Successfully"
          : "Contract Paused Successfully"
      );
    } catch (error) {
      console.error("Contract operation failed:", error);

      if (error.response) {
        setActionSuccess(
          `Error: ${error.response.data.message || error.response.statusText}`
        );
      } else if (error.request) {
        setActionSuccess("Error: No response from server");
      } else {
        setActionSuccess(`Error: ${error.message}`);
      }
    } finally {
      setShowPauseModal(false);
      setIsLoading(false);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const handleRevokeDocument = async () => {
    if (!revokeHash.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/documents/revoke",
        {
          documentHash: revokeHash,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ Success: Close modal and show success message
      setShowRevokeModal(false);
      setRevokeHash("");
      setActionSuccess("Document revoked successfully");
    } catch (error) {
      if (error.response && error.response.data?.message) {
        setActionSuccess(`Error: ${error.response.data.message}`);
      } else if (error.response && error.response.data?.error) {
        setActionSuccess(`Error: ${error.response.data.error}`);
      } else {
        setActionSuccess(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const openPauseModal = () => {
    setShowPauseModal(true);
  };

  const openRevokeModal = () => {
    setShowRevokeModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold mb-4 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-white shadow-md flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span>Back to Dashboard</span>
        </button>
        {/* Success Toast */}
        {actionSuccess && (
          <div className="fixed top-6 right-6 bg-white rounded-2xl shadow-2xl p-5 border-l-4 border-green-500 animate-slide-in z-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Success!</p>
                <p className="text-sm text-gray-600">{actionSuccess}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mb-4 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">
            Admin Control Panel
          </h1>
          <p className="text-purple-200 text-lg">
            Manage smart contract operations
          </p>
        </div>

        {/* Contract Status Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  contractPaused ? "bg-red-100" : "bg-green-100"
                } shadow-lg`}
              >
                <Activity
                  className={`w-8 h-8 ${
                    contractPaused ? "text-red-600" : "text-green-600"
                  }`}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Smart Contract Status
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                      contractPaused
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        contractPaused ? "bg-red-500" : "bg-green-500"
                      } animate-pulse`}
                    ></div>
                    {contractPaused ? "PAUSED" : "ACTIVE"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {contractPaused && (
            <div className="p-5 bg-red-50 rounded-2xl border-2 border-red-200 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-red-900 text-lg mb-1">
                    ⚠️ Emergency Mode Active
                  </p>
                  <p className="text-red-700">
                    The smart contract is currently paused. All operations
                    including document uploads and verifications are suspended.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
            <p className="text-gray-700 mb-1">
              <strong>Current State:</strong>{" "}
              {contractPaused
                ? "All contract functions are disabled"
                : "All systems operational"}
            </p>
            <p className="text-sm text-gray-600">
              {contractPaused
                ? "Resume the contract to restore normal operations"
                : "Pause the contract in case of security threats or detected vulnerabilities"}
            </p>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pause/Resume Card */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-purple-500/20 hover:shadow-3xl transition-all duration-300">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                contractPaused ? "bg-green-100" : "bg-orange-100"
              } shadow-lg`}
            >
              {contractPaused ? (
                <PlayCircle className="w-8 h-8 text-green-600" />
              ) : (
                <PauseCircle className="w-8 h-8 text-orange-600" />
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {contractPaused ? "Resume Contract" : "Pause Contract"}
            </h3>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {contractPaused
                ? "Restore all smart contract operations including uploads and verifications."
                : "Temporarily suspend all contract operations. Use this in emergency situations or when security vulnerabilities are detected."}
            </p>

            <button
              onClick={openPauseModal}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 text-lg ${
                contractPaused
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {contractPaused ? (
                  <>
                    <PlayCircle className="w-6 h-6" />
                    Resume Contract
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-6 h-6" />
                    Pause Contract
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Revoke Document Card */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-red-500/20 hover:shadow-3xl transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-6 shadow-lg">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Revoke Document
            </h3>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Permanently invalidate a document by entering its blockchain hash.
              This action cannot be undone. <br />
              &emsp;
            </p>

            <button
              onClick={openRevokeModal}
              className="w-full py-4 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 text-lg"
            >
              <div className="flex items-center justify-center gap-2">
                <XCircle className="w-6 h-6" />
                Revoke Document
              </div>
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
          <p className="text-white text-center text-sm">
            <Shield className="w-4 h-4 inline mr-2" />
            All actions are recorded on the blockchain and cannot be reversed
          </p>
        </div>

        {/* Pause/Resume Modal */}
        {showPauseModal && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => !isLoading && setShowPauseModal(false)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform scale-100 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl ${
                  contractPaused ? "bg-green-100" : "bg-orange-100"
                }`}
              >
                {contractPaused ? (
                  <PlayCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-orange-600" />
                )}
              </div>

              <h3 className="text-3xl font-bold text-gray-900 text-center mb-3">
                {contractPaused ? "Resume Contract?" : "Pause Contract?"}
              </h3>

              <p className="text-gray-600 text-center mb-6 text-lg">
                {contractPaused
                  ? "This will restore all contract operations."
                  : "This will immediately suspend all contract operations."}
              </p>

              {!contractPaused && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5 mb-6">
                  <p className="text-sm text-orange-900 font-bold mb-2">
                    ⚠️ Warning:
                  </p>
                  <ul className="text-sm text-orange-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      <span>No new documents can be uploaded</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      <span>Document verification will be disabled</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      <span>All contract functions will be suspended</span>
                    </li>
                  </ul>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPauseModal(false)}
                  disabled={isLoading}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePauseContract}
                  disabled={isLoading}
                  className={`flex-1 px-6 py-4 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    contractPaused
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  }`}
                >
                  {isLoading
                    ? "Processing..."
                    : contractPaused
                    ? "Resume"
                    : "Pause"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Revoke Modal */}
        {showRevokeModal && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => !isLoading && setShowRevokeModal(false)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 transform scale-100 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 rounded-2xl bg-red-100 mx-auto mb-6 flex items-center justify-center shadow-xl">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>

              <h3 className="text-3xl font-bold text-gray-900 text-center mb-3">
                Revoke Document
              </h3>

              <p className="text-gray-600 text-center mb-6 text-lg">
                Enter the document hash to permanently revoke it on the
                blockchain.
              </p>

              <div className="mb-6">
                <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                  <Hash className="w-5 h-5 mr-2 text-red-600" />
                  Document Hash
                </label>
                <input
                  type="text"
                  value={revokeHash}
                  onChange={(e) => setRevokeHash(e.target.value)}
                  placeholder="0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb..."
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all text-gray-900 placeholder-gray-400 font-mono text-sm"
                  disabled={isLoading}
                />
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-6">
                <p className="text-sm text-red-900 font-bold mb-2">
                  ⚠️ Critical Warning:
                </p>
                <p className="text-sm text-red-800">
                  Once revoked, this document will be permanently invalidated on
                  the blockchain. This action is <strong>irreversible</strong>{" "}
                  and cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRevokeModal(false);
                    setRevokeHash("");
                  }}
                  disabled={isLoading}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevokeDocument}
                  disabled={isLoading || !revokeHash.trim()}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:from-red-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? "Revoking..." : "Revoke Document"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
