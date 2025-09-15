import axios from "axios"; // To handle API requests
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom"; // Import necessary hooks
import { apiurl } from "../config/config";
import { BiError } from "react-icons/bi";
import { BlinkLoader } from "../components/loader";
import { setCookie } from "../config/webStorage.js";
import logo from "../logo.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UpdatePassword = () => {
  const { userObjId, updatePasswordToken } = useParams(); // Extract userId and token from URL params
  const navigate = useNavigate(); // To navigate after successful password update
  const [password, setPassword] = useState("");
  const [loginloading, setloginloading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Clear any previous errors
    setError("");

    try {
      setLoading(true);
      // Make API request to update password
      const response = await axios.put("/api/update-password", {
        userObjId,
        updatePasswordToken,
        password,
      });

      // If update is successful, redirect or show a success message
      if (response.status === 200) {
        navigate.push("/login"); // Navigate to login page or wherever needed
      }
    } catch (err) {
      setError("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className=" flex justify-center items-center w-full h-screen">
        <div className="rounded-lg md:shadow-sm md:border md:max-w-[66%]  md:min-h-[70%]   flex flex-col md:flex-row bg-white">
          <img
            src={logo}
            alt="Logo"
            className="h-16 md:hidden mx-auto mb-6 mt-10"
          />

          {/* Left Side */}
          <div className="w-full md:w-1/2 bg-indigo-50 p-8 md:flex flex-col justify-center items-center hidden ">
            <div className=" w-full flex flex-col justify-between h-full relative">
              <div className="flex  justify-center w-full">
                <img src={logo} alt="Logo" className="h-28 mb-6 " />
              </div>
              <div className="flex flex-col  justify-end pb-10 items-start h-full">
                <p className="text-5xl   font-semibold  text-left pr-10 text-gray-600 mb-8">
                  Building the future of digital experiences
                </p>
                <Link
                       to="https:/fixlabs.ai/signup"
                  className="block mt-5  text-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-xl rounded-md transition duration-200"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
            <div className="max-w-md w-full">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Update Your Password
              </h2>
              <p className="text-gray-500 text-center mb-8">
                Please enter new Password
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="max-w-md mx-auto mt-10">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Password Field */}
                    <div className="flex flex-col">
                      <label htmlFor="password" className="text-sm font-medium">
                        {/* New Password */}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter new password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-4"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <FaEyeSlash/> : <FaEye/>}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                      >
                        {/* Confirm Password */}
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-4"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {showPassword ? <FaEyeSlash/> : <FaEye/>}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {error && (
                  <div className="text-red-500 text-sm flex items-center gap-2">
                    <BiError /> {error}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      I accept the{" "}
                      <Link className="text-indigo-600 hover:underline" to="/">
                        {" "}
                        Terms and Conditions
                      </Link>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 relative text-white py-5 rounded-md transition duration-200 flex items-center justify-center"
                  disabled={handleSubmit}
                >
                  {loginloading ? <BlinkLoader /> : "Update Password"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account yet?{" "}
                  <Link
                    to="https:/fixlabs.ai/signup"
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;
