const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const {
  uploadDocument,
  verifyDocument,
  QRcodeVerification,
  pauseContract,
  getContractStatus,
  revokeDocument,
  getDocumentHistory,
  getDashboardStats,
} = require("../controllers/documentController");

const multer = require("multer");

const storage = multer.memoryStorage(); // We store file in memory buffer
const upload = multer({ storage });

router.post("/upload", protect, upload.single("document"), uploadDocument);
router.post("/verify", upload.single("document"), verifyDocument);
router.get("/verify/:hash", QRcodeVerification);
router.post("/pause-contract", protect, pauseContract);
router.get("/contract-status", protect, getContractStatus);
router.post("/revoke", protect, revokeDocument);
router.get("/history", protect, getDocumentHistory);
router.get("/dashboard-stats", protect, getDashboardStats);

module.exports = router;
