import React, { useState, useEffect } from "react";
import "./layout.css";
import { useUser } from "../config/userProvider";
import { IoHelp, IoPowerSharp, IoSettingsOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { removeCookie, getCookie } from "../config/webStorage.js";
import { useNavigate, NavLink } from "react-router-dom";
import Error from "../components/error";
import moment from "moment";
import { GoBell } from "react-icons/go";
import { CiSearch, CiUser } from "react-icons/ci";
import Input from "../components/inputContainer";
import { IoSearch } from "react-icons/io5";
import logo from "../assets/logo1.png";
import { FaRegUserCircle, FaUserEdit } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { RiUserAddFill } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";
import { usePermission } from "./getPermission.js";

const SearchHeader = ({ className }) => {
  const {
    token,
    openProfile,
    setCloseProfile,
    userData,
    isMenuOpen,
    setIsMenuOpen,
  } = useUser();
  const [decodedToken, setDecodedToken] = useState(token);
  const { userName, userType } = usePermission();

  useEffect(() => {
    const localToken = token || getCookie("zrotoken");
    if (localToken) {
      try {
        const decoded = jwtDecode(localToken);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);
  const [openSearch, setOpenSearch] = useState(false);

  const navigate = useNavigate();
  const logOutHandler = () => {
    removeCookie("zrotoken");
    navigate("/admin");
    // window.location.reload();
  };
  const [message, setMessage] = useState({ type: "", message: "" });

  const verificationDetails = userData?.verificationDetails;

  useEffect(() => {
    if (userData?.userType === "admin" || userData?.userType === "user") {
      if (userData?.storeDetails?.storeObjId) {
        if (
          !verificationDetails?.isEmailVerified &&
          !verificationDetails?.isPhoneVerified
        ) {
          setMessage({
            type: "error",
            message: "Email & Phone Verification is pending...",
          });
        } else if (
          !verificationDetails?.isEmailVerified &&
          verificationDetails?.isPhoneVerified
        ) {
          setMessage({
            type: "error",
            message: "Email Verification is pending...",
          });
        } else if (
          verificationDetails?.isEmailVerified &&
          !verificationDetails?.isPhoneVerified
        ) {
          setMessage({
            type: "error",
            message: "Phone Verification is pending...",
          });
        }
      } else if (!userData?.storeDetails?.storeObjId) {
        setMessage({
          type: "error",
          message: "Please verify the store from the admin",
        });
      }
    }
  }, [userData]);

  const Verification =
    ((userData?.userType === "admin" || userData?.userType === "user") &&
      !userData?.storeDetails?.storeObjId) ||
    (userData?.storeDetails?.storeObjId &&
      verificationDetails?.isEmailVerified);

  const FormattedDate = () => {
    const currentDate = moment(); // Get the current date and time
    const formattedDate = currentDate.format("dddd, DD MMMM YYYY");

    return <span>{formattedDate}</span>;
  };

  return (
    <div className="flex items-center justify-between bg-[#161616] px-5 py-2">
      {/* Shopify Logo */}
      <div className="flex items-center text-white text-xl font-semibold">{userType}</div>
      {/* Search Bar */}
      <div className="w-[45%] translate-x-[6rem]">
        <div className="flex items-center w-full max-w-xl bg-[#303030] rounded-xl border border-gray-600">
          <span className="pl-3 text-gray-400">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M16 16l4 4M3 11a8 8 0 1116 0 8 8 0 01-16 0z"
              />
            </svg>
          </span>
          <input
            className="bg-transparent outline-none px-3 py-1.5 text-gray-300 w-full border-gray-600"
            placeholder="Search"
            type="text"
          />
          <div className="flex items-center pr-3 space-x-1">
            <span className="bg-[#4e4e4e] border border-gray-600 rounded px-1 text-[10px] text-gray-400">
              CTRL
            </span>
            <span className="bg-[#4e4e4e] border border-gray-600 rounded px-1 text-[10px] text-gray-400">
              K
            </span>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Placeholder avatar icon */}
        <span className="text-white">
          <svg height={18} width={18} fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" fill="#fff" />
            <rect x="4" y="16" width="16" height="5" rx="2.5" fill="#fff" />
          </svg>
        </span>
        {/* Notification icon */}
        <span className="text-white">
          <svg height={15} width={15} fill="none" viewBox="0 0 24 24">
            <path
              stroke="#fff"
              strokeWidth={2}
              d="M12 22c1.1 0 2-.9 2-2H10a2 2 0 002 2zm6-6v-5a6 6 0 00-5-5.92V4a1 1 0 10-2 0v1.08A6 6 0 006 11v5l-1.7 1.7A1 1 0 005 20h14a1 1 0 00.7-1.7L18 16z"
            />
          </svg>
        </span>
        {/* Profile Chip */}
        <div
          className="flex items-center bg-fuchsia-600 rounded-lg px-3 py-1 cursor-pointer"
          onClick={() => setCloseProfile(!openProfile)}
        >
          <span className="text-white font-semibold mr-2 text-sm">
            {userName}
          </span>
          <span className="bg-gray-700 text-xs text-gray-300 rounded px-2 py-0.5 ml-1 text-center">
            dev
          </span>
        </div>
        <div className="flex items-center gap-2 lg:gap-4 relative">
          {openProfile && (
            <div className="absolute py-3 shadow-xl right-[-15px] top-[100%] bg-white/100 px-2 z-30 w-44 mt-4 rounded-md capitalize whitespace-pre">
              {userType === "Admin" && (
                <div
                  className="text-red-500 flex text-sm items-center  gap-2 cursor-pointer hover:bg-orange-400 hover:text-white p-1 rounded"
                  onClick={() => {
                    navigate("/addadmin");
                  }}
                >
                  <RiUserAddFill />
                  Add More Admin
                </div>
              )}
              <div
                className="text-red-500 flex text-sm items-center  gap-2 cursor-pointer hover:bg-orange-400 hover:text-white p-1 rounded"
                onClick={() => {
                  navigate("/update_password");
                }}
              >
                <TbLockPassword />
                Update Password
              </div>
              <div
                className="text-red-500 flex text-sm items-center  gap-2 cursor-pointer hover:bg-orange-400 hover:text-white p-1 rounded"
                onClick={() => {
                  navigate("/updateProfile");
                }}
              >
                <FaUserEdit />
                Update Profile
              </div>

              <div
                className="text-red-500 flex text-sm items-center  gap-2 cursor-pointer hover:bg-orange-400 hover:text-white p-1 rounded mb-2"
                onClick={logOutHandler}
              >
                <IoPowerSharp />
                logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
