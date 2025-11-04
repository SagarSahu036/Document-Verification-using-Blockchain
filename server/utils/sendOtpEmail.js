const nodemailer = require("nodemailer");

const sendOtpEmail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Blockchain Document Verifier" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP for Admin Login",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f6f8fa; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #2c3e50;">Admin Login Verification</h2>
            <p>Your one-time password is:</p>
            <h1 style="color:#4CAF50;">${otp}</h1>
            <p>This OTP will expire in <b>5 minutes</b>.</p>
            <p style="font-size:12px;color:#777;">If you did not request this, please ignore this email.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent:", info.messageId);
  } catch (error) {
    console.error("❌ OTP email error:", error);
  }
};

module.exports = sendOtpEmail;
