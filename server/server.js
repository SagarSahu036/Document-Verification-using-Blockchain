// Load core modules
const express = require("express");
const dotenv = require("dotenv");
// Load environment variables from .env file
dotenv.config();
const connectDB = require("./config/db");
const documentRoutes = require("./routes/documentRoutes");
const cors = require("./middlewares/cors");
const adminRoutes = require("./routes/adminRoutes");

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

app.use(cors);
// Middleware to parse JSON request bodies
app.use(express.json());
app.use("/api/documents", documentRoutes);
app.use("/api/admin", adminRoutes);

// Default test route
app.get("/", async (req, res) => {
  res.send("API is running");
});

// Use correct env variable name: should be PORT (not port)
const port = process.env.PORT || 5000;

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server is running on port ${port}`);
});
