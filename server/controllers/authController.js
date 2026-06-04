const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user.model");
const {
  succeesResponse,
  allFields_Response,
  serverError_Response,
} = require("../helper/responseHelper");

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Send OTP
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return allFields_Response(res);
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        status: false,
        message: "Email service is not configured",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await User.findOneAndUpdate(
      { email },
      { otp, otpExpiry },
      { upsert: true, returnDocument: 'after' }
    );

    // Email ko background me bhejo, taaki request block na ho.
    void transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Productr OTP",
      html: `<h2>Your OTP is: <b>${otp}</b></h2><p>Valid for 5 minutes only!</p>`,
    }).catch((error) => {
      console.log("OTP email failed:", error.message);
    });

    return succeesResponse(res, "OTP sent successfully");

  } catch (error) {
    console.log("ERROR:", error.message)
    return serverError_Response(res);
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
