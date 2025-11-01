import React, { useState } from 'react';
import { 
  Shield, Upload, Search, CheckCircle, XCircle, Hash, Calendar, 
  User, FileText, ExternalLink, AlertCircle, ArrowLeft 
} from 'lucide-react';
import axios from 'axios'; // ✅ Use axios for consistency

export default function PublicVerifyPage() {
  const [verificationMethod, setVerificationMethod] = useState('hash'); // 'hash' or 'file'
  const [hashInput, setHashInput] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

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
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError('');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    }
  };

  // ✅ REAL HASH VERIFICATION
  const handleVerifyByHash = async () => {
    if (!hashInput.trim()) {
      setError('Please enter a document hash');
      return;
    }

    setVerifying(true);
    setResult(null);
    setError('');

    try {
      // ✅ Correct endpoint: /api/documents/verify/:hash
      const response = await axios.get(
        `http://localhost:5000/api/documents/verify/${hashInput.trim()}`
      );

      setResult({
        isValid: true,
        message: "Document is verified and active on blockchain",
        document: response.data.document
      });
    } catch (error) {
      console.error('Hash verification error:', error);
      
      // Handle different error cases
      if (error.response?.status === 404) {
        setResult({
          isValid: false,
          message: "Document not found on blockchain"
        });
      } else if (error.response?.status === 410) {
        setResult({
          isValid: false,
          message: "Document has been revoked and is no longer valid"
        });
      } else {
        setResult({
          isValid: false,
          message: "Verification failed. Please check the hash and try again."
        });
      }
    } finally {
      setVerifying(false);
    }
  };

  // ✅ REAL FILE VERIFICATION
  const handleVerifyByFile = async () => {
    if (!file) {
      setError('Please upload a PDF document');
      return;
    }

    setVerifying(true);
    setResult(null);
    setError('');

    try {
      const formData = new FormData();
      formData.append('document', file);

      // ✅ Correct endpoint: POST /api/documents/verify
      const response = await axios.post(
        'http://localhost:5000/api/documents/verify',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const { verified, hash, message } = response.data;

      if (verified) {
        // If verified, fetch full document details by hash
        const docResponse = await axios.get(
          `http://localhost:5000/api/documents/verify/${hash}`
        );
        
        setResult({
          isValid: true,
          message: "Document is verified and active on blockchain",
          document: docResponse.data.document
        });
      } else {
        setResult({
          isValid: false,
          message: message || "Document not found on blockchain"
        });
      }
    } catch (error) {
      console.error('File verification error:', error);
      
      if (error.response?.data?.error) {
        setResult({
          isValid: false,
          message: error.response.data.error
        });
      } else {
        setResult({
          isValid: false,
          message: "Verification failed. Please try again."
        });
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleVerify = () => {
    if (verificationMethod === 'hash') {
      handleVerifyByHash();
    } else {
      handleVerifyByFile();
    }
  };

  const handleBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-purple-300 hover:text-white font-semibold mb-8 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all border border-white/20">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Verify Document</h1>
          <p className="text-xl text-purple-200">Check if your document is authentic and registered on blockchain</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center">
            {error}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          
          {/* Method Selection */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                setVerificationMethod('hash');
                setFile(null);
                setResult(null);
                setError('');
              }}
              className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                verificationMethod === 'hash'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/5 text-purple-300 hover:bg-white/10 border border-white/20'
              }`}
            >
              <Hash className="w-5 h-5 inline mr-2" />
              Verify by Hash
            </button>
            <button
              onClick={() => {
                setVerificationMethod('file');
                setHashInput('');
                setResult(null);
                setError('');
              }}
              className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                verificationMethod === 'file'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/5 text-purple-300 hover:bg-white/10 border border-white/20'
              }`}
            >
              <Upload className="w-5 h-5 inline mr-2" />
              Verify by File
            </button>
          </div>

          {/* Verification Input */}
          {verificationMethod === 'hash' ? (
            <div className="space-y-4">
              <label className="flex items-center text-sm font-semibold text-white mb-2">
                <Hash className="w-5 h-5 mr-2 text-purple-400" />
                Enter Document Hash
              </label>
              <input
                type="text"
                value={hashInput}
                onChange={(e) => {
                  setHashInput(e.target.value);
                  setError('');
                }}
                placeholder="0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb..."
                className="w-full px-5 py-4 rounded-xl bg-white/5 border-2 border-white/20 focus:border-purple-500 focus:outline-none transition-all text-white placeholder-purple-300/50 font-mono text-sm"
              />
              <p className="text-sm text-purple-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                The hash can be found on your document certificate or QR code
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="flex items-center text-sm font-semibold text-white mb-2">
                <Upload className="w-5 h-5 mr-2 text-purple-400" />
                Upload Document PDF
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 ${
                  dragActive 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : file 
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-white/20 hover:border-purple-500/50 bg-white/5'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                      <div className="text-left">
                        <p className="font-semibold text-white text-lg">{file.name}</p>
                        <p className="text-sm text-purple-300">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                      <p className="text-white font-medium mb-2 text-lg">
                        Drop your PDF here or click to browse
                      </p>
                      <p className="text-sm text-purple-300">Only PDF files are accepted</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={verifying || (verificationMethod === 'hash' ? !hashInput.trim() : !file)}
            className={`w-full mt-8 py-5 rounded-xl font-bold text-lg shadow-lg transition-all ${
              verifying
                ? 'bg-gray-600 cursor-wait'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1'
            } text-white`}
          >
            {verifying ? (
              <span className="flex items-center justify-center">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Verifying on Blockchain...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Search className="w-6 h-6 mr-2" />
                Verify Document
              </span>
            )}
          </button>

          {/* Result Display */}
          {result && (
            <div className={`mt-8 rounded-2xl p-6 border-2 ${
              result.isValid 
                ? 'bg-green-500/10 border-green-500' 
                : 'bg-red-500/10 border-red-500'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {result.isValid ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    <h3 className="text-2xl font-bold text-white">✅ Document Verified!</h3>
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8 text-red-400" />
                    <h3 className="text-2xl font-bold text-white">❌ Verification Failed</h3>
                  </>
                )}
              </div>

              <p className={`mb-6 text-lg ${result.isValid ? 'text-green-200' : 'text-red-200'}`}>
                {result.message}
              </p>

              {result.isValid && result.document && (
                <div className="space-y-4 bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-bold text-white mb-4">Document Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.document.primaryName && (
                      <div>
                        <p className="text-sm text-purple-300 mb-1 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Recipient Name
                        </p>
                        <p className="text-white font-semibold">{result.document.primaryName}</p>
                      </div>
                    )}
                    
                    {result.document.documentType && (
                      <div>
                        <p className="text-sm text-purple-300 mb-1 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Document Type
                        </p>
                        <p className="text-white font-semibold">{result.document.documentType}</p>
                      </div>
                    )}
                    
                    {result.document.uploadDate && (
                      <div>
                        <p className="text-sm text-purple-300 mb-1 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Issue Date
                        </p>
                        <p className="text-white font-semibold">{result.document.uploadDate}</p>
                      </div>
                    )}
                    
                    {result.document.expiryDate && (
                      <div>
                        <p className="text-sm text-purple-300 mb-1 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Expiry Date
                        </p>
                        <p className={`font-semibold ${result.document.expiryDate === 'Lifetime' ? 'text-green-400' : 'text-white'}`}>
                          {result.document.expiryDate}
                        </p>
                      </div>
                    )}
                  </div>

                  {result.document.hash && (
                    <div className="mt-4">
                      <p className="text-sm text-purple-300 mb-2 flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Blockchain Hash
                      </p>
                      <code className="block text-xs text-white bg-white/10 p-3 rounded-lg font-mono break-all border border-white/20">
                        {result.document.hash}
                      </code>
                    </div>
                  )}

                  {result.document.transactionHash && (
                    <div className="mt-4">
                      <p className="text-sm text-purple-300 mb-2 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Transaction Hash
                      </p>
                      <code className="block text-xs text-white bg-white/10 p-3 rounded-lg font-mono break-all border border-white/20">
                        {result.document.transactionHash}
                      </code>
                    </div>
                  )}

                  {result.document.status && (
                    <div className="mt-4">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                        result.document.status === 'Active'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : 'bg-red-500/20 text-red-400 border border-red-500/50'
                      }`}>
                        {result.document.status === 'Active' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Status: {result.document.status}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Info Banner */}
          <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm text-purple-200 text-center">
              <Shield className="w-4 h-4 inline mr-2" />
              All verifications are performed against the immutable blockchain ledger
            </p>
          </div>
        </div>

        {/* How to Verify Section */}
        <div className="mt-12 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">How to Verify Your Document</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">1</span>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">By Document Hash</h4>
                <p className="text-purple-300 text-sm">Enter the unique hash code found on your document or certificate</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">2</span>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">By PDF Upload</h4>
                <p className="text-purple-300 text-sm">Upload the original PDF document to verify its authenticity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}