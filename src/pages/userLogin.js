import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BiError } from "react-icons/bi";
import { BlinkLoader } from "../components/loader";
import { setCookie } from "../config/webStorage.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { apiurl, logoUrl, loginSideImage } from "../config/config";
import logo from "../assets/logo.png";
import LoginBanner from "../assets/logo1.png";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const UserLogin = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loginType, setLoginType] = useState("");
  const [error, setError] = useState("");
  const [loginloading, setloginloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter email address");
    if (!password) return setError("Please enter password");
    if (!loginType) return setError("Please selct login type");
    try {
      setloginloading(true);
      const response = await axios.post(`${apiurl}/auth/login`, {
        email: email,
        loginType:loginType,
        password,
      });
      if (response?.data?.success === true) {
        const loginToken = response?.data?.token;
        const decodedToken = jwtDecode(loginToken);
        console.log("decoded Token data ----------->>>>>", decodedToken);
        localStorage.setItem("accessToken", loginToken);
        setCookie("zrotoken", loginToken);
        // setCookie("zrotoken", 12345);
        navigate("/dashboard");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Login failed. Please try again.");
       const message = error.response.data?.error || error.response.data?.message;
      toast.warn(message,{
        position: "top-center",
        autoClose: 6000,
      });
    } finally {
      setloginloading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-orange-50 md:bg-gray-100">
      <div className="flex w-11/12 md:w-8/12 h-[80%] flex-row-reverse bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
          <div className="w-full">
            <div className="flex justify-center items-center hidden">
              <img
                src={logoUrl ? logoUrl : logo}
                alt="Logo"
                className="h-12 mb-6 text-center w-auto"
              />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Login to continue to your account
            </p>
            {error && (
              <div className="text-red-500 text-sm flex items-center gap-2 mb-4">
                <BiError /> {error}
              </div>
            )}
            <form onSubmit={loginHandler} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-[65%] -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              <div>
                <select name="loginType"  onChange={(e) => {
                    setLoginType(e.target.value);
                    setError("");
                  }}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>Select Login Type</option>
                  <option value="Admin">Admin</option>
                  <option value="Seller">Seller</option>
                  <option value="User">User</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-[#f7a420] text-black py-3 h-12 relative rounded-md font-medium hover:bg-orange-600 transition flex items-center justify-center"
                disabled={loginloading}
              >
                {loginloading ? <BlinkLoader /> : "Sign In"}
              </button>
            </form>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            lost your password?{" "}
            <Link to="/forgetpassword" className="text-orange-600 hover:underline">Forgot Password</Link>
          </p>
        </div>
        <div className="hidden md:flex w-1/2 items-center justify-center bg-black">
          {loginSideImage ? (
            <img
              src={loginSideImage}
              alt="Login Visual"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex justify-center items-center w-full">
              <img src={LoginBanner} alt="LoginBanner" className="w-3/4 rounded-[30px]" />
            </div>
          )}

          {/* <div
            className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600"
            style={{ clipPath: "circle(70% at 50% 50%)" }}
          ></div> */}
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
