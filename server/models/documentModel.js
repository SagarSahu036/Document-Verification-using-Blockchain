const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    documentType: { type: String, required: true },
    primaryName: { type: String, required: true },
    uploadDate: { type: String, required: true },
    validityDays: { type: Number, default: 0 },
    expiryDate: { type: String },
    email: { type: String },
    mobile: { type: String },
    hash: { type: String, required: true, unique: true },
    transactionHash: { type: String, required: true },
    status: {
      type: String,
      enum: ["Active", "Revoked"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
