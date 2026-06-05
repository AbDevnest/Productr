const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user.model");
const {
  succeesResponse,
  allFields_Response,
  serverError_Response,
} = require("../helper/responseHelper");

// ✅ Fixed Brevo SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // smtp-relay.brevo.com
  port: Number(process.env.SMTP_PORT), // 587
  secure: false,                      // false for port 587 (STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,     // Brevo login email (NOT sender email)
    pass: process.env.EMAIL_PASS,     // Brevo SMTP Password (from SMTP & API tab)
  },
  tls: {
    rejectUnauthorized: false,        // ✅ Render pe SSL error fix
  },
});

// ✅ Startup pe connection verify karo
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Failed:", error.message);
  } else {
    console.log("✅ SMTP Server Ready - Emails will be sent!");
  }
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Productr" <abhishekkumawat799@gmail.com>`,
    to: email,
    subject: "Your Productr OTP",
    text: `Your OTP is ${otp}. Valid for 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #1e3a8a;">Productr - OTP Verification</h2>
        <p>Your One-Time Password is:</p>
        <h1 style="letter-spacing: 8px; color: #1e3a8a;">${otp}</h1>
        <p style="color: #888; font-size: 13px;">Valid for <b>5 minutes</b>. Do not share it with anyone.</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("✅ OTP sent to:", email, "| Message ID:", info.messageId);
};

// Send OTP
const sendOTP = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        status: false,
        message: "Please enter a valid email address",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await User.findOneAndUpdate(
      { email },
      { otp, otpExpiry },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email, otp);

    return succeesResponse(res, "OTP sent successfully");
  } catch (error) {
    console.error("❌ [sendOTP] ERROR:", error.message);

    // ✅ User ko clear error message
    if (error.code === "EAUTH") {
      return res.status(500).json({
        status: false,
        message: "Email service authentication failed. Contact support.",
      });
    }
    if (error.code === "ECONNECTION" || error.code === "ETIMEDOUT") {
      return res.status(500).json({
        status: false,
        message: "Email service unavailable. Please try again.",
      });
    }

    return res.status(500).json({
      status: false,
      message: "Failed to send OTP. Please try again.",
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) return allFields_Response(res);

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ status: false, message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ status: false, message: "OTP expired. Please request a new one." });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return succeesResponse(res, "Login successful", { token, email });
  } catch (error) {
    console.error("❌ [verifyOTP] ERROR:", error.message);
    return serverError_Response(res);
  }
};

module.exports = { sendOTP, verifyOTP };