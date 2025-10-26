const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const Admin = require("../models/Admin.js");
const dotenv = require("dotenv");
dotenv.config();

// Connect to MongoDB
connectDB();

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new Admin({
      name: "Super Admin",
      email: "sagarsah0457@gmail.com",
      password: hashedPassword,
      role: "admin",
      organization: "ABC University",
    });
    await admin.save();
    console.log("Admin added successfully!");
  } catch (err) {
    console.error("Error adding admin:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
