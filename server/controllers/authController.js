const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const {
  succeesResponse,
  allFields_Response,
  serverError_Response,
} = require("../helper/responseHelper");

const sendOtpEmail = async (email, otp) => {
  const subject = "Your Productr OTP";
  const text = `Your Productr OTP is ${otp}. It is valid for 5 minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #1e3a8a;">Productr - OTP Verification</h2>
      <p>Your One-Time Password is:</p>
      <h1 style="letter-spacing: 8px; color: #1e3a8a;">${otp}</h1>
      <p style="color: #888; font-size: 13px;">This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Productr <onboarding@resend.dev>",
      to: [email],
      subject,
      text,
      html,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("[sendOtpEmail] Resend error:", JSON.stringify(data));
    throw new Error(data?.message || "Email delivery failed");
  }

  console.log("[sendOtpEmail] Resend sent successfully to:", email, "| id:", data.id);
};

// Send OTP
const sendOTP = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    console.log("[sendOTP] Step 1: request received", { email });

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        status: false,
        message: "Please enter a valid email address",
      });
    }

    if (!process.env.RESEND_API_KEY && (!process.env.EMAIL_USER || !process.env.EMAIL_PASS)) {
      console.log("[sendOTP] Step 2: email env missing");
      return res.status(500).json({
        status: false,
        message: "Email service is not configured",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    console.log("[sendOTP] Step 2: OTP generated", { otp, otpExpiry });

    await User.findOneAndUpdate(
      { email },
      { otp, otpExpiry },
      { upsert: true, returnDocument: 'after' }
    );

    console.log("[sendOTP] Step 3: OTP saved in database");

    console.log("[sendOTP] Step 4: sending mail...");
    await sendOtpEmail(email, otp);

    console.log("[sendOTP] Step 5: mail sent successfully", { email });

    return succeesResponse(res, "OTP sent successfully");

  } catch (error) {
    console.log("[sendOTP] ERROR:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Server Error",
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) return allFields_Response(res);

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ status: false, message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ status: false, message: "OTP expired" });
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return succeesResponse(res, "Login successful", { token, email });

  } catch (error) {
    console.log(error);
    return serverError_Response(res);
  }
};

module.exports = { sendOTP, verifyOTP };