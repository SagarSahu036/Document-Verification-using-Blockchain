import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  FileText,
  Calendar,
  Hash,
  CheckCircle,
  XCircle,
  Eye,
  Mail,
  Phone,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DocumentHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const documentTypes = [
    "all",
    "Certificate",
    "Relieving Letter",
    "Land Record",
    "Degree Certificate",
    "Experience Letter",
    "Property Document",
  ];
  const statuses = ["all", "Active", "Revoked"];

  const navigate = useNavigate();

  // Fetch documents from backend
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/documents/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;

      if (data.success) {
        setDocuments(data.documents);
      } else {
        console.error("Failed to fetch documents:", data.message);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-100 text-red-700 border-red-200";
  };

  const getStatusIcon = (status) => {
    return status === "Active" ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <XCircle className="w-4 h-4" />
    );
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.primaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.hash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.documentType === filterType;
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;
    const matchesDate = !dateFilter || doc.uploadDate === dateFilter;

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const truncateHash = (hash) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold mb-4 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-white shadow-md flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span>Back to Dashboard</span>
        </button>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Document History
              </h1>
              <p className="text-gray-600">
                Track and manage all blockchain-verified documents
              </p>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl shadow-lg border border-gray-100">
              <p className="text-sm text-gray-500">Total Documents</p>
              <p className="text-3xl font-bold text-indigo-600">
                {documents.length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Filters & Search
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, type, or hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all text-gray-900"
              />
            </div>

            {/* Document Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all text-gray-900 bg-white"
            >
              {documentTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "All Document Types" : type}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all text-gray-900 bg-white"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All Statuses" : status}
                </option>
              ))}
            </select>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all text-gray-900"
              />
            </div>
          </div>

          {/* Active Filters Summary */}
          {(searchTerm ||
            filterType !== "all" ||
            filterStatus !== "all" ||
            dateFilter) && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-gray-600">
                Showing {filteredDocuments.length} of {documents.length}{" "}
                documents
              </span>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setFilterStatus("all");
                  setDateFilter("");
                }}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Primary Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Document Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Upload Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Expiry Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Hash
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-indigo-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {doc.primaryName.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">
                            {doc.primaryName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span className="text-gray-700">
                            {doc.documentType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{doc.uploadDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-medium ${
                            doc.expiryDate === "Lifetime"
                              ? "text-green-600"
                              : "text-gray-700"
                          }`}
                        >
                          {doc.expiryDate}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded font-mono">
                            {truncateHash(doc.hash)}
                          </code>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
                            doc.status
                          )}`}
                        >
                          {getStatusIcon(doc.status)}
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-all text-sm flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">
                        No documents found
                      </p>
                      <p className="text-gray-400 text-sm">
                        Try adjusting your filters or search terms
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Active Documents</p>
                <p className="text-3xl font-bold text-green-600">
                  {documents.filter((d) => d.status === "Active").length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Revoked Documents</p>
                <p className="text-3xl font-bold text-red-600">
                  {documents.filter((d) => d.status === "Revoked").length}
                </p>
              </div>
              <XCircle className="w-12 h-12 text-red-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedDoc && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50"
            onClick={() => setSelectedDoc(null)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-gray-900">
                  Document Details
                </h3>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Primary Name</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedDoc.primaryName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Document Type</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedDoc.documentType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Upload Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedDoc.uploadDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Expiry Date</p>
                    <p
                      className={`text-lg font-semibold ${
                        selectedDoc.expiryDate === "Lifetime"
                          ? "text-green-600"
                          : "text-gray-900"
                      }`}
                    >
                      {selectedDoc.expiryDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Validity Days</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedDoc.validityDays === 0
                        ? "Lifetime"
                        : `${selectedDoc.validityDays} days`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                        selectedDoc.status
                      )}`}
                    >
                      {getStatusIcon(selectedDoc.status)}
                      {selectedDoc.status}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                {(selectedDoc.email || selectedDoc.mobile) && (
                  <div className="border-t-2 border-gray-200 pt-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-2 gap-6">
                      {selectedDoc.email && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email
                          </p>
                          <p className="text-base font-semibold text-gray-900">
                            {selectedDoc.email}
                          </p>
                        </div>
                      )}
                      {selectedDoc.mobile && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Mobile
                          </p>
                          <p className="text-base font-semibold text-gray-900">
                            {selectedDoc.mobile}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Blockchain Info */}
                <div className="border-t-2 border-gray-200 pt-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    Blockchain Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Document Hash
                      </p>
                      <code className="block text-xs text-gray-800 bg-gray-100 p-3 rounded-lg font-mono break-all">
                        {selectedDoc.hash}
                      </code>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Transaction Hash
                      </p>
                      <code className="block text-xs text-gray-800 bg-gray-100 p-3 rounded-lg font-mono break-all">
                        {selectedDoc.transactionHash}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
