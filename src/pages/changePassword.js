import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import Layout from "../components/layout";
import axios from "axios";
import { apiurl } from "../config/config";
import { getCookie } from "../config/webStorage";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const token = getCookie("zrotoken");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "confirmPassword") {
      if (formData.password && value !== formData.password) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
    if (name === "password") {
      if (value.length >= 6) {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
      if (formData.confirmPassword && formData.confirmPassword !== value) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;
    let validationErrors = {};

    if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(
        `${apiurl}/admin/updatepassword`,
        { password },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success === true) {
        toast.success("Password changed successfully!");
        setFormData({ password: "", confirmPassword: "" });
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.message || "Failed to submit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center h-[calc(100vh-105px)]">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-6 border rounded-xl shadow-md bg-white space-y-6 m-4"
        >
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`w-full border rounded-lg px-4 py-2 pr-10 ${
                  errors.password ? "border-red-500" : ""
                }`}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password   
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className={`w-full border rounded-lg px-4 py-2 pr-10 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4550B] hover:bg-[#d4550b] text-white font-medium py-2 rounded-lg transition"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ChangePassword;
