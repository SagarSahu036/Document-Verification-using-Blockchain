const { ethers } = require('ethers');
require('dotenv').config();

// Load from .env
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contractABI = [
  "function storeHash(bytes32 hash, uint256 validityDays) external",
  "function storeHashBatch(bytes32[] calldata hashes, uint256 validityDays) external",
  "function revokeHash(bytes32 hash) external",
  "function isVerified(bytes32 hash) view returns (bool)",
  "function getVerificationData(bytes32 hash) view returns (bool, uint256, uint256, uint256, address, string memory)",
  "function setIssuer(address wallet, string calldata name, bool isAuthorized) external",
  "function setPaused(bool _paused) external",
  "event DocumentVerified(bytes32 indexed hash, address indexed issuer, uint256 issuedAt, uint256 expiresAt)",
  "event DocumentRevoked(bytes32 indexed hash, address revoker, uint256 revokedAt)",
  "event IssuerUpdated(address indexed issuer, string name, bool isAuthorized)",
  "event PausedStateChanged(bool paused)"
];

// Connect to Ganache
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

module.exports = { contract };