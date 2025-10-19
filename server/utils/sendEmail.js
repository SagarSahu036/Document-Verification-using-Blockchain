const nodemailer = require("nodemailer")
const sendEmail = async (to, hash, verificationLink) => {
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
      to: to,
      subject: "Document Successfully Verified and Stored",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f6f8fa; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50;">Document Verification Successful</h2>
            <p style="font-size: 15px; color: #333;">
              Hello, your document has been securely stored on the blockchain.
            </p>
            <p style="font-size: 14px; color: #555;">
              <strong>Document Hash:</strong> ${hash}
            </p>
            <a href="${verificationLink}"
               style="display: inline-block; padding: 10px 16px; margin-top: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
              Verify Document
            </a>
            <p style="font-size: 12px; color: #777; margin-top: 20px;">
              This is an automated message from Blockchain Document Verifier.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email error:", error);
  }
};

module.exports = sendEmail