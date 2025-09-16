// src/components/UploadZone.jsx
import axios from "axios";
import React, { useState } from "react";

function UploadZone() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection via button
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      uploadToBackend(selectedFile);
    }
  };

  // Called when file hovers over box
  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow drop
    setIsDragging(true);
  };

  // Called when file leaves the box
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Called when file is dropped
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      uploadToBackend(droppedFile);
    }
  };

  const uploadToBackend = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/documents/verify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("respose", response.data);
      setResult(response.data);
    } catch (error) {
      setResult({
        verified: false,
        message: "Failed to verify document. Please try again.",
      });
      console.log("error", error);
    }
  };

  return (
    <div
      className={`border-2 border-dashed p-8 text-center rounded-lg bg-gray-800 transition-all duration-300 ${
        isDragging
          ? "border-green-500 bg-green-900/20 scale-105"
          : "border-blue-500 hover:border-blue-400"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ width: "400px", margin: "0 auto" }}
    >
      {/* Icon */}
      <div className="mb-4">
        <svg
          className="w-20 h-20 mx-auto text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>

      {/* Text */}
      <p className="text-white text-lg mb-2">Drag and drop your document</p>
      <p className="text-gray-400 text-sm">to verify its authenticity</p>

      {/* Or line */}
      <div className="mt-6 flex items-center justify-center">
        <div className="h-px w-16 bg-gray-600"></div>
        <span className="mx-2 text-gray-500 text-sm">or</span>
        <div className="h-px w-16 bg-gray-600"></div>
      </div>

      {/* Button */}
      <label className="mt-4 inline-block px-6 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition cursor-pointer">
        Select File
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}

export default UploadZone;
