import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiurl } from "../config/config";
import { BiError } from "react-icons/bi";
import { BlinkLoader } from "../components/loader";
import { setCookie } from "../config/webStorage.js";
import logo from "../logo.svg";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loginloading, setloginloading] = useState(false);
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter email address");
    try {
      setloginloading(true);
      const response = await axios.post(`${apiurl}/admin/v1/user/login`, {
        email,
      });
      if (!response.data.success) {
        setError(response.data.message);
      } else {
        const loginToken = response.data.token;
        setCookie("zrotoken", loginToken, 50 * 60);
        navigate("/dashboard");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setloginloading(false);
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
                Forget your account password
              </h2>
              <p className="text-gray-500 text-center mb-8">
                Please enter your email address
              </p>

              <form onSubmit={loginHandler} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                  />
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
                  disabled={loginloading}
                >
                  {loginloading ? <BlinkLoader /> : "Reset Password"}
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

export default ForgetPassword;