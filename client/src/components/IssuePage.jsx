// src/components/IssuePage.jsx
import React, { useState, useRef } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { saveAs } from "file-saver";

function IssuePage() {
  const [file, setFile] = useState(null);
  const [validityDays, setValidityDays] = useState(0);
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [hash, setHash] = useState("");
  const qrCode = useRef(null);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a document");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("validityDays", parseInt(validityDays) || 0); // 0 = lifetime
    formData.append("email", email);

    const token = localStorage.getItem("token");

    setUploading(true);
    setResult(null);

    console.log("formData sending", formData);
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
    <div>
      <div className="max-w-lg mx-auto p-8 bg-gray-800 rounded-lg shadow-xl mt-10">
        <h2 className="text-2xl font-bold text-blue-400 mb-6">
          Issue New Certificate
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          Upload a document to issue it on the blockchain. Set validity period
          below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Validity Days */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Validity (Days) - 0 for lifetime
            </label>
            <input
              type="number"
              min="0"
              value={validityDays}
              onChange={(e) => setValidityDays(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 365 (0 = lifetime)"
              required
            />
          </div>
          {/* Add this inside your form above the submit button */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Recipient Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email to send notification"
              className="w-full px-4 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Upload Document */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Upload Document (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-1 block w-full text-sm text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-500 file:text-white
                      hover:file:bg-blue-600"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium rounded-md transition"
          >
            {uploading ? "Issuing..." : "Issue Certificate"}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div
            className={`mt-6 p-4 rounded text-sm ${
              ["success", "issued", "stored", "verified", "completed"].some(
                (keyword) => result.message?.toLowerCase().includes(keyword)
              )
                ? "bg-green-900/60 text-green-100"
                : "bg-red-900/60 text-red-100"
            }`}
          >
            <strong>
              {["success", "issued", "stored", "verified", "completed"].some(
                (keyword) => result.message?.toLowerCase().includes(keyword)
              )
                ? "✅ Success!"
                : "❌ Failed"}
            </strong>
            <p>{result.message}</p>
            {result.transactionHash && (
              <p>
                <small>Tx: {result.transactionHash.slice(0, 10)}...</small>
              </p>
            )}
          </div>
        )}
      </div>
      {hash && (
        <>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6" // tailwind: change size with h-*/w-*
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
              onClick={handleDownload}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v12m0 0l4-4m-4 4l-4-4M4 21h16"
              />
            </svg>
          </div>
          <div ref={qrCode}>
            <h3>QR Code for Verification</h3>
            {/* The QR code points to your backend verification URL */}
            <QRCodeSVG
              value={`http://192.168.0.5:5173/verify/${hash}`}
              size={200} // QR code size
              level="H" // Error correction level
            />
          </div>
        </>
      )}
    </div>
  );
}

export default IssuePage;
