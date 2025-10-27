const { generateHash } = require("../utils/hashGenerator");
const Document = require("../models/documentModel");
const { contract } = require("../blockchain/ethers");
const sendEmail = require("../utils/sendEmail");

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const { originalname, mimetype, buffer } = req.file;

    // Optional: Validate file type
    if (!mimetype.startsWith("application/pdf")) {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }

    console.log(`📄 Uploading: ${originalname}, Type: ${mimetype}`);

    // Generate SHA-256 hash
    const fileHash = generateHash(buffer);
    console.log("hash-----------", fileHash);

    // Check if already on blockchain
    const isOnChain = await contract.isVerified(fileHash);
    console.log("isOnChain-----------", isOnChain);

    if (isOnChain) {
      return res.status(200).json({
        message: "Document already verified on blockchain",
        hash: fileHash,
      });
    }

    // Get validityDays from request body (default: 0 = lifetime)
    const { validityDays, email } = req.body;
    const days = parseInt(validityDays) || 0; // Ensure it's a number

    // Store on blockchain
    const tx = await contract.storeHash(fileHash, days);
    console.log(`🚀 Transaction submitted: ${tx.hash}`);

    const receipt = await tx.wait();

    if (receipt.status !== 1) {
      return res
        .status(500)
        .json({ error: "Transaction failed on blockchain" });
    }

    // after successful blockchain storage

    await sendEmail(
      email,
      fileHash,
      `http://192.168.0.4:5173/verify/${fileHash}`
    );

    return res.status(200).json({
      message: "Document hash stored on blockchain",
      hash: fileHash,
      transactionHash: tx.hash,
      validityDays: days,
    });
  } catch (err) {
    console.error("❌ Upload failed:", err);

    // Handle known errors or generic fallback
    return res.status(500).json({
      error: "File upload failed",
      details: err.message,
    });
  }
};

const verifyDocument = async (req, res) => {
  try {
    // 1. Validate file upload
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded. Please provide a document.",
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
        ? "Document is verified on blockchain"
        : "Document not found or has been revoked",
    });
  } catch (err) {
    console.error("Verification failed:", err);
    return res.status(500).json({
      error: "Failed to verify document",
      details: "Could not connect to blockchain",
    });
  }
};

const QRcodeVerification = async (req, res) => {
  try {
    const fileHash = req.params.hash;
    const result = await contract.getVerificationData(fileHash);
    const formatted = {
      active: result[0], // Boolean
      issuedAt: Number(result[1]), // BigInt -> Number (timestamp)
      expiresAt: Number(result[2]), // BigInt -> Number (timestamp)
      revokedAt: Number(result[3]), // BigInt -> Number (timestamp)
      issuer: result[4], // Ethereum address
      issuerName: result[5], // Human-readable issuer name
      hash: fileHash, // Original hash
    };

    // Return structured JSON
    return res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to verify document",
      details: error.message || "Could not connect to blockchain",
    });
  }
};

const pauseContract = async (req, res) => {
  try {
    // 1. Validate input (same as your file validation)
    const { action } = req.body;

    if (!action || !["pause", "unpause"].includes(action)) {
      return res
        .status(400)
        .json({ message: "Action must be 'pause' or 'unpause'" });
    }

    console.log(` Contract ${action} requested`);

    // 2. Execute on blockchain (same as your storeHash)
    const tx = await contract.setPaused(action === "pause");
    console.log(` Transaction submitted: ${tx.hash}`);

    // 3. Wait for confirmation (same as your tx.wait())
    const receipt = await tx.wait();

    if (receipt.status !== 1) {
      return res
        .status(500)
        .json({ error: "Transaction failed on blockchain" });
    }

    // 4. Return success response (same structure as your upload)
    return res.status(200).json({
      message: `Contract ${
        action === "pause" ? "paused" : "unpaused"
      } successfully`,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
    });
  } catch (err) {
    console.error(" Pause operation failed:", err);

    // 5. Error handling (same pattern as your upload)
    return res.status(500).json({
      error: "Contract operation failed",
      details: err.message,
    });
  }
};

const getContractStatus = async (req, res) => {
  try {
    // Now you can check REAL blockchain state!
    const isPaused = await contract.paused();

    return res.status(200).json({
      paused: isPaused,
      contractAddress: process.env.CONTRACT_ADDRESS,
      message: isPaused ? "Contract is paused" : "Contract is active",
    });
  } catch (err) {
    console.error("Status check failed:", err);
    return res.status(500).json({
      error: "Failed to get contract status",
      details: err.message,
    });
  }
};

const revokeDocument = async (req, res) => {
  try {
    const { documentHash } = req.body;

    if (!documentHash) {
      return res.status(400).json({ message: "Document hash is required" });
    }

    const isCurrentlyVerified = await contract.isVerified(documentHash);
    if (!isCurrentlyVerified) {
      return res.status(400).json({
        message: "Document not found or already revoked",
      });
    }

    const tx = await contract.revokeHash(documentHash);
    const receipt = await tx.wait();

    if (receipt.status !== 1) {
      return res
        .status(500)
        .json({ error: "Transaction failed on blockchain" });
    }

    return res.status(200).json({
      message: "Document revoked successfully",
      documentHash: documentHash,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Document revoke failed",
      details: err.message,
    });
  }
};

module.exports = {
  uploadDocument,
  verifyDocument,
  QRcodeVerification,
  pauseContract,
  getContractStatus,
  revokeDocument,
};
