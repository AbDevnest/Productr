const authRouter = require("express").Router();
const { sendOTP, verifyOTP } = require("../controllers/authController");

authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTP);

module.exports = authRouter;