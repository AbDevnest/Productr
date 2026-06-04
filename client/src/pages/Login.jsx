import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOTP } from "../api/authApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await sendOTP(email);
      if (res.data.status) {
        localStorage.setItem("pending_email", email);
        if (res.data.data?.otp) {
          localStorage.setItem("pending_otp", res.data.data.otp);
        }
        // OTP page pe jao
        navigate("/otp", { state: { email, otp: res.data.data?.otp } });
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="flex flex-col lg:flex-row lg:h-screen ">
    
    {/* Left Side */}
    <div
      className="lg:w-1/2 w-full relative flex items-center justify-center lg:m-auto lg:ms-5 lg:min-h-[96vh] min-h-[60vh] lg:rounded-3xl"
      style={{
        background: "linear-gradient(180deg, #c4c1f1 0%, #e6caca 50%, #e4d0bd 100%)",
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
      <h2 className="sm:text-2xl text-xl font-bold text-center mb-4">
        Login to your Productr Account
      </h2>

      <div className="w-full max-w-md">
        <label className="text-sm text-gray-600">Email or Phone number</label>
        <input
          type="email"
          placeholder="Enter email or phone number"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded w-full mt-1"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-900 text-white py-3 rounded w-full max-w-md font-semibold"
      >
        {loading ? "Sending..." : "Login"}
      </button>

      <div className="border rounded p-4 w-full max-w-md text-center mt-5 lg:mt-20">
        <p className="text-gray-500 text-sm">Don't have a Productr Account?</p>
        <p className="text-blue-900 font-bold cursor-pointer">SignUp Here</p>
      </div>
    </div>

  </div>
)
}
