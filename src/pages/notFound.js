import React, { useEffect } from "react";
import Layout from "../components/layout";
import { Link } from "react-router-dom";
import { removeCookie } from "../config/webStorage";

const NotFound = () => {
  useEffect(() => {
    setTimeout(() => {
      removeCookie("zrotoken");
      window.location.href = "/";
    }, 1000);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>

        <Link
          to="/dashboard"
          className="inline-block bg-[#ff6900] text-white py-2 px-6 rounded-full hover:bg-orange-500 transition duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;
