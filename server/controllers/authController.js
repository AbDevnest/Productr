const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/user.model");
const {
  succeesResponse,
  allFields_Response,
  serverError_Response,
} = require("../helper/responseHelper");

// ✅ Brevo HTTP API - No SMTP, No Port issues!
const sendOtpEmail = async (email, otp) => {
  const response = await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "Productr",
        email: "abhishekkumawat799@gmail.com",
      },
      to: [{ email: email }],
      subject: "Your Productr OTP",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #1e3a8a;">Productr - OTP Verification</h2>
          <p>Your One-Time Password is:</p>
          <h1 style="letter-spacing: 8px; color: #1e3a8a;">${otp}</h1>
          <p style="color: #888; font-size: 13px;">Valid for <b>5 minutes</b>. Do not share it with anyone.</p>
        </div>
      `,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  console.log("✅ OTP sent to:", email, "| Message ID:", response.data.messageId);
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
      { upsert: true, returnDocument: "after" }
    );

    await sendOtpEmail(email, otp);

    return succeesResponse(res, "OTP sent successfully");
  } catch (error) {
    console.error("❌ [sendOTP] ERROR:", error.response?.data || error.message);
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
      return res.status(400).json({
        status: false,
        message: "OTP expired. Please request a new one.",
      });
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