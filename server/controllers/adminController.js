const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Otp = require("../models/Otp");
const sendOtpEmail = require("../utils/sendOtpEmail");

// Optional hardcoded fallback OTP for demo safety
const BACKUP_OTP = "123456";

// STEP 1 - Verify password and send real OTP
const requestOtpLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // ✅ Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB with expiry
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      { upsert: true, new: true }
    );

    // ✅ Send email via NodeMailer
    await sendOtpEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your registered email",
    });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// STEP 2 - Verify OTP (real + fallback)
const verifyOtpLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP required" });

    const record = await Otp.findOne({ email });
    if (!record) {
      // ❗ If no OTP record, still allow BACKUP_OTP for viva
      if (otp === BACKUP_OTP) {
        console.warn("⚠️ Using backup OTP (fallback mode)");
      } else {
        return res.status(400).json({ message: "OTP not found" });
      }
    }

    // Check expiry if real OTP used
    if (record && record.expiresAt < new Date()) {
      if (otp !== BACKUP_OTP) {
        return res.status(400).json({ message: "OTP expired" });
      }
    }

    // Verify real OTP OR fallback OTP
    if (record && otp !== record.otp && otp !== BACKUP_OTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ OTP valid — delete real OTP
    if (record) await Otp.deleteOne({ email });

    const admin = await Admin.findOne({ email });
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      name: admin.name,
      role: admin.role,
      organization: admin.organization,
    });
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

module.exports = { requestOtpLogin, verifyOtpLogin };
