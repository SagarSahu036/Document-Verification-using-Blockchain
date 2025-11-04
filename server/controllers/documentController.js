const { generateHash } = require("../utils/hashGenerator");
const Document = require("../models/documentModel");
const { contract } = require("../blockchain/ethers");
const sendEmail = require("../utils/sendEmail");

const uploadDocument = async (req, res) => {
  try {
    //  Validate file
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, mimetype, buffer } = req.file;
    if (!mimetype.startsWith("application/pdf")) {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }

    console.log(`📄 Uploading: ${originalname}, Type: ${mimetype}`);

    //  Generate SHA-256 hash
    const fileHash = generateHash(buffer);
    console.log("Generated Hash:", fileHash);

    //  Check if already on blockchain
    const isOnChain = await contract.isVerified(fileHash);
    if (isOnChain) {
      return res.status(200).json({
        message: "Document already verified on blockchain",
        hash: fileHash,
      });
    }

    //  Get form data from request body
    const {
      documentType,
      primaryName,
      uploadDate,
      validityDays,
      expiryDate,
      email,
      mobile,
    } = req.body;

    let days = parseInt(validityDays) || 0;

    //  Store hash on blockchain
    const tx = await contract.storeHash(fileHash, days);
    console.log(`🚀 Transaction submitted: ${tx.hash}`);

    const receipt = await tx.wait();
    if (receipt.status !== 1) {
      return res
        .status(500)
        .json({ error: "Transaction failed on blockchain" });
    }

    //  Save document metadata in MongoDB
    const newDoc = new Document({
      documentType,
      primaryName,
      uploadDate,
      validityDays: days,
      expiryDate,
      email,
      mobile,
      hash: fileHash,
      transactionHash: tx.hash,
      status: "Active",
    });

    await newDoc.save();
    console.log("✅ Document metadata saved to MongoDB");

    //  Send notification email (optional)
    if (email) {
      await sendEmail(
        email,
        fileHash,
        `http://localhost:5173/verify/${fileHash}`
      );
    }

    //  Return response
    return res.status(200).json({
      message: "Document stored successfully (Blockchain + MongoDB)",
      hash: fileHash,
      transactionHash: tx.hash,
      validityDays: days,
    });
  } catch (err) {
    console.error("❌ Upload failed:", err);
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
    const blockchainData = {
      active: result[0], // Boolean
      issuedAt: Number(result[1]), // BigInt -> Number (timestamp)
      expiresAt: Number(result[2]), // BigInt -> Number (timestamp)
      revokedAt: Number(result[3]), // BigInt -> Number (timestamp)
      issuer: result[4], // Ethereum address
      issuerName: result[5], // Human-readable issuer name
      hash: fileHash, // Original hash
    };
    const documentData = await Document.findOne({ hash: fileHash });

    return res.status(200).json({
      blockchain: blockchainData,
      document: documentData,
    });

    // Return structured JSON
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
      return res.status(409).json({
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
    const updatedDoc = await Document.findOneAndUpdate(
      { hash: documentHash },
      {
        status: "Revoked",
        revokedAt: new Date(),
        revokeTransactionHash: tx.hash,
      },
      { new: true }
    );

    if (!updatedDoc) {
      console.warn(
        `Document hash ${documentHash} revoked on chain but not found in DB`
      );
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

const getDocumentHistory = async (req, res) => {
  try {
    console.log("📋 Fetching document history...");

    // Fetch all documents from MongoDB
    const documents = await Document.find().sort({ createdAt: -1 }).lean();
    console.log(`✅ Found ${documents.length} documents`);

    // Process documents sequentially with delays
    const formattedDocuments = [];

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];

      // Add delay to avoid overwhelming the blockchain node
      if (i > 0) await new Promise((resolve) => setTimeout(resolve, 100));

      let blockchainStatus = "Unknown";

      try {
        // Get REAL status from blockchain
        const result = await contract.getVerificationData(doc.hash);
        const isActive = result[0]; // Boolean from blockchain
        const revokedAt = Number(result[3]);

        // Use the REAL blockchain status
        if (revokedAt > 0) {
          blockchainStatus = "Revoked";
        } else if (!isActive) {
          blockchainStatus = "Inactive";
        } else {
          blockchainStatus = "Active";
        }
      } catch (blockchainError) {
        console.error(
          `❌ Blockchain error for ${doc.hash}:`,
          blockchainError.message
        );
        blockchainStatus = "Blockchain Error";
      }

      // Calculate expiry date (for display only)
      let expiryDate = "Lifetime";
      if (doc.validityDays > 0 && doc.uploadDate) {
        const upload = new Date(doc.uploadDate);
        const expiry = new Date(upload);
        expiry.setDate(expiry.getDate() + doc.validityDays);
        expiryDate = expiry.toISOString().split("T")[0];
      }

      formattedDocuments.push({
        id: doc._id,
        documentType: doc.documentType || "Unknown",
        primaryName: doc.primaryName || "N/A",
        uploadDate: doc.uploadDate || "N/A",
        expiryDate: doc.expiryDate || expiryDate,
        validityDays: doc.validityDays || 0,
        hash: doc.hash,
        transactionHash: doc.transactionHash,
        status: blockchainStatus, // REAL blockchain status
        email: doc.email || null,
        mobile: doc.mobile || null,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      });
    }

    return res.status(200).json({
      success: true,
      count: formattedDocuments.length,
      documents: formattedDocuments,
    });
  } catch (err) {
    console.error("❌ Failed to fetch document history:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch document history",
      error: err.message,
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    // Get all documents from DB
    const documents = await Document.find().lean();

    const totalDocuments = documents.length;

    // Documents created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const issuedToday = documents.filter(
      (doc) => new Date(doc.createdAt) >= today
    ).length;

    // Status counts (from MongoDB, already saved or fetched)
    let activeCount = 0;
    let revokedCount = 0;
    let inactiveCount = 0;

    for (let doc of documents) {
      const result = await contract.getVerificationData(doc.hash);
      const isActive = result[0];
      const revokedAt = Number(result[3]);

      if (revokedAt > 0) revokedCount++;
      else if (!isActive) inactiveCount++;
      else activeCount++;
    }

    // You can skip user count if you do not have users collection
    const totalUsers = 0;

    return res.status(200).json({
      success: true,
      data: {
        totalDocuments,
        issuedToday,
        revokedDocuments: revokedCount,
        activeDocuments: activeCount,
        inactiveDocuments: inactiveCount,
        totalUsers,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching dashboard stats:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: err.message,
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
  getDocumentHistory,
  getDashboardStats,
};
