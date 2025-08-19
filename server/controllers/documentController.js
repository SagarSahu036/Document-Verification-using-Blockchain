const { generateHash } = require('../utils/hashGenerator');
const Document = require('../models/documentModel');

const uploadDocument = async (req, res) => {
  try {
    console.log("📤 uploadDocument controller called!");
    console.log("📎 File received in req.file:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, mimetype, buffer } = req.file;

    // Generate SHA-256 hash
    const fileHash = generateHash(buffer);
    console.log("hash-----------",fileHash)
    // Check if the hash already exists in DB
    const existing = await Document.findOne({ hash: fileHash });
    if (existing) {
      return res.status(200).json({
        message: "File already exists",
        hash: fileHash,
        saved: existing,
      });
    }

    // Save new document to MongoDB
    const newDoc = new Document({
      filename: originalname,
      fileType: mimetype,
      hash: fileHash,
    });

    const savedDoc = await newDoc.save();

    return res.status(200).json({
      message: "File uploaded successfully",
      hash: fileHash,
      saved: savedDoc,
    });

  } catch (err) {
    console.error("❌ Upload failed:", err);

    if (err.code === 11000) {
      return res.status(200).json({ message: "File already exists", hash });
    } else {
      return res.status(500).json({ error: "File upload failed" });
    }
  }
};

module.exports = { uploadDocument };
