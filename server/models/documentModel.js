const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
  },
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  // Optional: Add userId if you want auth later
});

module.exports = mongoose.model('Document', documentSchema);
