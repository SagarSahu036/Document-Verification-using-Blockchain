import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Mail,
  Calendar,
  User,
  Shield,
  CheckCircle,
  Hash,
  Phone,
  Download,
  QrCode,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { saveAs } from "file-saver";
import { useNavigate } from 'react-router-dom';

function IssuePage() {
  // Keep all your original state
  const [file, setFile] = useState(null);
  const [validityDays, setValidityDays] = useState("");
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [hash, setHash] = useState("");
  const qrCode = useRef(null);
  const [email, setEmail] = useState("");

  // New fields for enhanced form
  const [documentType, setDocumentType] = useState("");
  const [primaryName, setPrimaryName] = useState("");
  const [uploadDate, setUploadDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [expiryDate, setExpiryDate] = useState("");
  const [mobile, setMobile] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const navigate = useNavigate();

  const documentTypes = [
    "Certificate",
    "Relieving Letter",
    "Land Record",
    "Degree Certificate",
    "Experience Letter",
    "Property Document",
  ];

  // Auto-calculate expiry date
  const handleValidityChange = (value) => {
    setValidityDays(value);
    if (value === "0" || value === "") {
      setExpiryDate("Lifetime");
    } else {
      const upload = new Date(uploadDate);
      const expiry = new Date(upload);
      expiry.setDate(expiry.getDate() + parseInt(value));
      setExpiryDate(expiry.toISOString().split("T")[0]);
    }
  };

  const showErrorToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    }
  };

  // Keep your original handleSubmit function (just showing structure - use your actual code)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a document");
      return;
    }

    const isMissingMandatory =
      !file ||
      !documentType.trim() ||
      !primaryName.trim() ||
      !uploadDate || // always set, but included for safety
      validityDays === "" ||
      validityDays === null; // must be provided (even "0" is OK)

    if (isMissingMandatory) {
      showErrorToast("Please fill in all mandatory fields.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("validityDays", parseInt(validityDays) || 0);
    formData.append("email", email);
    formData.append("documentType", documentType);
    formData.append("primaryName", primaryName);
    formData.append("uploadDate", uploadDate);
    formData.append("mobile", mobile);

    const token = localStorage.getItem("token");
    setUploading(true);
    setResult(null);

    // Your axios call here - keeping your original logic
    console.log("Submitting form data:", formData);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/documents/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("res", response);
      setResult(response.data);
      setHash(response.data.hash);
    } catch (error) {
      setResult({
        message:
          error.response?.data?.message ||
          "Failed to issue certificate. Try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = () => {
    const container = qrCode.current;
    if (!container) {
      console.error("Container not found inside qrCode ref.");
      return;
    }

    const svg = container.querySelector("svg");
    if (!svg) {
      console.error("SVG element not found.");
      return;
    }

    // Get SVG dimensions
    const width = svg.clientWidth;
    const height = svg.clientHeight;

    // Scale factor for higher resolution (2x, 3x, etc.)
    const scale = 3;

    // Serialize SVG
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    // Create image from SVG
    const img = new Image();
    img.onload = () => {
      // Create canvas with scaled dimensions
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");

      // Scale context for higher resolution
      ctx.scale(scale, scale);

      // Draw image on canvas
      ctx.drawImage(img, 0, 0);

      // Convert to PNG and download
      canvas.toBlob((blob) => {
        saveAs(blob, "QRcode.png");
        URL.revokeObjectURL(url);
      });
    };
    img.src = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      {/* Error Toast (matches AdminControlPanel style) */}
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-white rounded-2xl shadow-2xl p-5 border-l-4 border-red-500 animate-fadeIn z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Error</p>
              <p className="text-sm text-gray-600">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-4xl mx-auto">
         <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold mb-4 transition-colors group">
        <div className="w-8 h-8 rounded-lg bg-white shadow-md flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span>Back to Dashboard</span>
      </button>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Issue Document
          </h1>
          <p className="text-gray-600">
            Secure blockchain-verified document issuance
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-gray-100">
          <div className="space-y-6">
            {/* Document Type & Primary Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                  Document Type<span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-gray-900 bg-white"
                  required
                >
                  <option value="">Select document type</option>
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <User className="w-4 h-4 mr-2 text-indigo-600" />
                  Primary Name (Recipient)
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={primaryName}
                  onChange={(e) => setPrimaryName(e.target.value)}
                  placeholder="Student/Employee/Owner name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Upload Date & Validity Days Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                  Upload Date<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={uploadDate}
                  onChange={(e) => setUploadDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-gray-900"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                  Validity Period<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={validityDays}
                    onChange={(e) => handleValidityChange(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    days (0 = lifetime)
                  </span>
                </div>
              </div>
            </div>

            {/* Expiry Date & Mobile Number Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  readOnly
                  placeholder="Auto-calculated"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <Phone className="w-4 h-4 mr-2 text-indigo-600" />
                  Mobile Number{" "}
                  <span className="text-gray-400 font-normal ml-1">
                    (Optional)
                  </span>
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                Email{" "}
                <span className="text-gray-400 font-normal ml-1">
                  (Optional - for notifications)
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recipient@example.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Upload className="w-4 h-4 mr-2 text-indigo-600" />
                Upload Document<span className="text-red-500 ml-1">*</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-50"
                    : file
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-indigo-400 bg-gray-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <div className="text-center">
                  {file ? (
                    <div className="flex items-center justify-center space-x-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-700 font-medium mb-1">
                        Drop your PDF here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Only PDF files are accepted
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading}
              className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 ${
                uploading
                  ? "bg-gray-400 cursor-wait"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Issuing...
                </span>
              ) : (
                "Issue Document on Blockchain"
              )}
            </button>
          </div>

          {/* Result & QR Code Display */}
          {result && (
            <div className="mt-6 space-y-4">
              <div
                className={`p-4 rounded-xl ${
                  ["success", "issued", "stored", "verified", "completed"].some(
                    (keyword) => result.message?.toLowerCase().includes(keyword)
                  )
                    ? "bg-green-50 border-2 border-green-200"
                    : "bg-red-50 border-2 border-red-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {[
                    "success",
                    "issued",
                    "stored",
                    "verified",
                    "completed",
                  ].some((keyword) =>
                    result.message?.toLowerCase().includes(keyword)
                  ) ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <h3
                    className={`text-lg font-bold ${
                      [
                        "success",
                        "issued",
                        "stored",
                        "verified",
                        "completed",
                      ].some((keyword) =>
                        result.message?.toLowerCase().includes(keyword)
                      )
                        ? "text-green-900"
                        : "text-red-900"
                    }`}
                  >
                    {[
                      "success",
                      "issued",
                      "stored",
                      "verified",
                      "completed",
                    ].some((keyword) =>
                      result.message?.toLowerCase().includes(keyword)
                    )
                      ? "✅ Success!"
                      : "❌ Failed"}
                  </h3>
                </div>
                <p
                  className={
                    [
                      "success",
                      "issued",
                      "stored",
                      "verified",
                      "completed",
                    ].some((keyword) =>
                      result.message?.toLowerCase().includes(keyword)
                    )
                      ? "text-green-800"
                      : "text-red-800"
                  }
                >
                  {result.message}
                </p>
                {result.transactionHash && (
                  <p className="text-sm text-green-700 mt-2">
                    Transaction: {result.transactionHash.slice(0, 20)}...
                  </p>
                )}
              </div>

              {/* QR Code Section - keeping your QRCodeSVG logic */}
              {hash && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                  <div className="flex flex-col items-center">
                    <label className="flex items-center text-lg font-bold text-indigo-900 mb-4">
                      <QrCode className="w-6 h-6 mr-2" />
                      Document QR Code
                    </label>
                    <div
                      ref={qrCode}
                      className="bg-white p-6 rounded-xl shadow-lg border-2 border-indigo-300"
                    >
                      {/* Your QRCodeSVG component goes here */}
                      <div className="w-52 h-52 bg-gray-100 flex items-center justify-center rounded-lg">
                        <QRCodeSVG
                          value={`http://192.168.0.4:5173/verify/${hash}`}
                          size={200} // QR code size
                          level="H" // Error correction level
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleDownload}
                      type="button"
                      className="mt-6 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <Download className="w-5 h-5" />
                      Download QR Code
                    </button>
                    <p className="text-sm text-indigo-700 mt-3 text-center">
                      Scan this QR code to verify the document
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info Banner */}
          <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-sm text-indigo-800 text-center">
              <Shield className="w-4 h-4 inline mr-1" />
              This document will be cryptographically secured and permanently
              recorded on the blockchain
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Powered by blockchain technology for tamper-proof verification
        </p>
      </div>
    </div>
  );
}

export default IssuePage;
