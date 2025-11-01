const cors = require("cors");

const corsOptions = {
  origin: ['http://localhost:5173', 'http://192.168.0.4:5173'], // allow frontend dev server
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // allow cookies if needed
};

module.exports = cors(corsOptions);
