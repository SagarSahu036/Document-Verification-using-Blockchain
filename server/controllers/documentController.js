const { generateHash } = require('../utils/hashGenerator');
const Document = require('../models/documentModel');
const { contract } = require('../blockchain/ethers');

const uploadDocument = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, mimetype, buffer } = req.file;

    // Generate SHA-256 hash
    const fileHash = generateHash(buffer);
    console.log("hash-----------", fileHash)

    const isOnChain = await contract.isVerified(fileHash)
    console.log("isOnChain-----------", isOnChain)

    // const existing = await Document.findOne({ hash: fileHash });
    if (isOnChain) {
      return res.status(200).json({
        message: "Document already verified on blockchain",
        hash: fileHash,
      });
    }

    let validityDays = 0;
    const tx = await contract.storeHash(fileHash, validityDays);

    console.log(`🚀 Transaction submitted: ${tx.hash}`);

    const receipt = await tx.wait();

    if (receipt.status !== 1) {
      return res.status(500).json({ error: 'Transaction failed on blockchain' });
    }


    return res.status(200).json({
      message: "Document hash stored on blockchain",
      hash: fileHash,
      transactionHash: tx.hash,
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

const verifyDocument = async (req, res) => {
  try {
    // 1. Validate file upload
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded. Please provide a document.'
      });
    }

    const { buffer } = req.file;

    // 2. Generate SHA-256 hash using same function as upload
    const fileHash = generateHash(buffer);

    // 3. Check blockchain
    const isOnChain = await contract.isVerified(fileHash);

    // 4. Return standardized JSON response
    return res.status(200).json({
      verified: isOnChain,
      hash: fileHash,
      message: isOnChain
        ? 'Document is verified on blockchain'
        : 'Document not found or has been revoked'
    });

  } catch (err) {
    console.error('Verification failed:', err);
    return res.status(500).json({
      error: 'Failed to verify document',
      details: 'Could not connect to blockchain'
    });
  }
};
module.exports = { uploadDocument, verifyDocument };
