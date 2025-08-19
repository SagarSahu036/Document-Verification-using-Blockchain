// Load core modules
const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const documentRoutes = require('./routes/documentRoutes');


// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDb();

// Initialize Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use('/api/documents', documentRoutes);

// Default test route
app.get("/", async (req, res) => {
    res.send("API is running");
});

// Use correct env variable name: should be PORT (not port)
const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});
