import React, { useState } from "react";
import { use } from "../../../server/routes/documentRoutes";
import axios from "axios";

function IssuePage() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return "please select a file";
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/documents/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("upload success", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <label className="mt-4 inline-block px-6 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition cursor-pointer">
        Select File
      </label>
      <input type="file" onChange={handleFileChange} accept=".pdf" />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
export default IssuePage;
