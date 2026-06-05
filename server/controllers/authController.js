const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user.model");
const {
  succeesResponse,
  allFields_Response,
  serverError_Response,
} = require("../helper/responseHelper");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `Productr <${process.env.EMAIL_USER}>`,
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
  });
  console.log("[sendOtpEmail] OTP sent to:", email);
};

// Send OTP
const sendOTP = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return res.status(400).json({ status: false, message: "Please enter a valid email address" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await User.findOneAndUpdate(
      { email },
      { otp, otpExpiry },
      { upsert: true }
    );

    await sendOtpEmail(email, otp);

    return succeesResponse(res, "OTP sent successfully");

  } catch (error) {
    console.error("[sendOTP] ERROR:", error.message);
    return res.status(500).json({ status: false, message: "Failed to send OTP. Please try again." });
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

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return succeesResponse(res, "Login successful", { token, email });

  } catch (error) {
    console.error("[verifyOTP] ERROR:", error.message);
    return serverError_Response(res);
  }
};

module.exports = { sendOTP, verifyOTP };
