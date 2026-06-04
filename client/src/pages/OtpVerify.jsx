import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOTP, sendOTP } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30); // 20 second timer
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email = location.state?.email;

  // Timer logic
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await verifyOTP(email, otp);
      if (res.data.status) {
        login(res.data.data.token, email);
        navigate("/home");
      }
    } catch (err) {
      setError("Invalid OTP!");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendOTP(email);
      setTimer(30); // timer reset
      setCanResend(false); // resend band
      setOtp("");
      setError("");
    } catch (err) {
      setError("Failed to resend OTP!");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* left Side */}
      <div
        className="lg:w-1/2 w-full relative flex items-center justify-center lg:m-auto lg:ms-5 lg:min-h-[96vh] min-h-[60vh] lg:rounded-3xl"
        style={{
          background:
            "linear-gradient(180deg, #c4c1f1 0%, #e6caca 50%, #e4d0bd 100%)",
        }}
      >
        <img
          src="/logo.png"
          className="absolute top-4 left-4 w-28 z-10"
          alt="Productr"
        />
        <img
          src="/images/bg-frame.png"
          className="absolute inset-0 w-full h-full object-fill lg:rounded-3xl opacity-40"
          alt=""
        />
        <img
          src="/images/poster-image.png"
          className="relative z-10 w-36 sm:w-48 md:w-64 rounded-3xl poster"
          alt="Uplist your product"
        />
      </div>
      {/* Right Side */}
      <div className="lg:w-1/2 flex flex-col items-center justify-center gap-4 px-8 lg:px-16 py-8">
        <h2 className="text-2xl font-bold text-center">
          Login to your Productr Account
        </h2>

        <div className="w-full max-w-md">
          <label className="text-sm text-gray-600">Enter OTP</label>
          <input
            type="text"
            placeholder="Enter 6 digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-3 rounded w-full mt-1"
            maxLength={6}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-blue-900 text-white py-3 rounded w-full max-w-md font-semibold"
        >
          {loading ? "Verifying..." : "Enter your OTP"}
        </button>

        {/* Resend */}
        <p className="text-sm text-gray-500">
          Didn't receive OTP?{" "}
          {canResend ? (
            <span
              onClick={handleResend}
              className="font-bold text-blue-900 cursor-pointer"
            >
              Resend
            </span>
          ) : (
            <span className="font-bold text-gray-400">Resend in {timer}s</span>
          )}
        </p>
      </div>
    </div>
  );
}
