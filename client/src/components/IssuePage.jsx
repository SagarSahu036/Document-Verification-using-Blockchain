// src/components/IssuePage.jsx
import React, { useState } from "react";
import axios from "axios";

function IssuePage() {
  const [file, setFile] = useState(null);
  const [validityDays, setValidityDays] = useState(0);
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a document");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("validityDays", parseInt(validityDays) || 0); // 0 = lifetime

    setUploading(true);
    setResult(null);

    console.log("formData sending", formData);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/documents/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("res", response);
      setResult(response.data);
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

  return (
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
  );
}

export default IssuePage;
