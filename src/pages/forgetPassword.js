import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiurl } from "../config/config";
import { BiError } from "react-icons/bi";
import { BlinkLoader } from "../components/loader";
import { Link, useNavigate } from "react-router-dom";
import { getCookie } from "../config/webStorage";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [otpId, setOtpId] = useState(null);
  const navigate = useNavigate();

  const token = getCookie("zrotoken");

  // resend state
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email");
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(`${apiurl}/auth/send-otp`, {
        email,
        userType,
      });
      if (res.data.success === true) {
        setStep(2);
        setResendCooldown(60);
      } else {
        setError(res.data.message || "Failed to send OTP");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return setError("Please enter OTP");
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(`${apiurl}/auth/verify-otp`, {
        email,
        otp,
        userType,
      });
      if (res.data.success === true) {
        setOtpId(res.data?.data?.otpId);
        setStep(3);
      } else {
        setError(res.data?.message || "Invalid OTP");
      }
    } catch {
      console.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    handleSendOtp(new Event("submit"));
  };

  const validatePassword = (value, confirmValue = cpassword) => {
    const errors = [];
    if (value.length < 8)
      errors.push("• Password must be at least 8 characters");
    if (!/[A-Z]/.test(value)) errors.push("• Must contain an uppercase letter");
    if (!/[a-z]/.test(value)) errors.push("• Must contain a lowercase letter");
    if (!/[0-9]/.test(value)) errors.push("• Must contain a number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
      errors.push("• Must contain a special character");

    if (confirmValue && value !== confirmValue) {
      errors.push("• Password and Confirm Password must match");
    }

    if (errors.length > 0) {
      setError(errors.join("\n"));
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!password || !cpassword) return setError("All fields are required");

    if (!validatePassword(password, cpassword)) return;

    try {
      setLoading(true);
      setError("");
      const res = await axios.post(`${apiurl}/auth/forget-password`, {
        email,
        password,
        otpId,
      });
      if (res.data.success) {
        setStep(4);
      } else {
        setError(res.data.message || "Failed to reset password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const SuccessScreen = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Password Reset Successful
      </h2>
      <p className="text-gray-500 mb-6">
        Your password has been changed successfully.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-medium transition"
      >
        Go to Login
      </button>
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Forgot Password
            </h2>
            <p className="text-gray-500 text-center mb-8 text-sm">
              Please enter your registered email address
            </p>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm whitespace-pre-line flex items-start gap-1">
                  <BiError className="mt-0.5" /> {error}
                </div>
              )}

              <div>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option>Select Login Type</option>
                  <option value="Admin">Admin</option>
                  <option value="Seller">Seller</option>
                  <option value="User">User</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-md flex justify-center"
              >
                {loading ? "loading..." : "Send OTP"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?
                <Link
                  to="http://localhost:3017/"
                  className="text-orange-600 hover:text-orange-500 pl-2 font-medium"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Verify OTP
            </h2>
            <p className="text-gray-500 text-center mb-4 text-sm">
              Enter the OTP sent to <span className="font-medium">{email}</span>
            </p>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                autoComplete="off"
                maxLength={6}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-center tracking-widest text-lg"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError("");
                }}
              />
              {error && (
                <div className="text-red-500 text-sm flex items-center gap-1">
                  <BiError /> {error}
                </div>
              )}

              <div className="flex justify-center mb-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className={`text-sm ${
                    resendCooldown > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-orange-600 hover:underline"
                  }`}
                >
                  {resendCooldown > 0
                    ? `Resend OTP in ${resendCooldown}s`
                    : "Resend OTP"}
                </button>
              </div>

              <div className="flex justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 bg-gray-200 text-gray-700 font-medium py-3 rounded-md"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-md flex justify-center"
                >
                  {loading ? "loading..." : "Verify OTP"}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-500 text-center mb-6 text-sm">
              Set a new password for{" "}
              <span className="font-medium text-gray-600">{email}</span>
            </p>
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  autoComplete="off"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value, cpassword);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showCPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  autoComplete="off"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={cpassword}
                  onChange={(e) => {
                    setCPassword(e.target.value);
                    validatePassword(password, e.target.value);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCPassword(!showCPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showCPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {error && (
                <div className="text-red-500 text-sm whitespace-pre-line flex items-start gap-1">
                  <BiError className="mt-0.5" /> {error}
                </div>
              )}

              <div className="flex justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/2 bg-gray-200 text-gray-700 font-medium py-3 rounded-md"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-md flex justify-center"
                >
                  {loading ? <BlinkLoader /> : "Reset Password"}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 4 && <SuccessScreen />}
      </div>
    </div>
  );
};

export default ForgotPassword;
