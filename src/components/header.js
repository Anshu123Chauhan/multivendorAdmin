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
import { FaRegUserCircle, FaUserEdit  } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { RiUserAddFill } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";
import { usePermission } from "./getPermission.js";

const Header = ({ className }) => {
  const {
    token,
    openProfile,
    setCloseProfile,
    userData,
    isMenuOpen,
    setIsMenuOpen,
  } = useUser();
  const [decodedToken, setDecodedToken] = useState(token);
  const { userName, userType }  = usePermission()


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
    ((userData?.userType === "admin" || userData?.userType === "user") && !userData?.storeDetails?.storeObjId) || (userData?.storeDetails?.storeObjId &&
      verificationDetails?.isEmailVerified);

  const FormattedDate = () => {
    const currentDate = moment(); // Get the current date and time
    const formattedDate = currentDate.format("dddd, DD MMMM YYYY");

    return <span>{formattedDate}</span>;
  };
  return (
    <div
      className={`bg-white border-orange-500/50 border shadow-sm shadow-orange-300 rounded-lg px-3 py-8 flex items-center justify-between sm:w-full w-[95%] border-b sm:m-0 m-2 sm:mb-2 ${className}`}
    >
      <div className="py-2 md:hidden block cursor-pointer">
        <RxHamburgerMenu onClick={() => setIsMenuOpen(true)} />
      </div>
      <div className="flex items-end gap-2">
        <div className="hidden md:block">
          <h1 className="text-xs md:text-sm lg:text-xl font-medium capitalize hidden md:block">
            Welcome Back, Hi {userName}
          </h1>
          <p className="text-zinc-400 text-xs">Today is {FormattedDate()}</p>
        </div>
        <NavLink to="/dashboard">
          <img
            className="logoImage h-10 block sm:block md:hidden "
            src={logo}
            alt="logo"
          />
        </NavLink>
        {/* <div className="capitalize bg-blue-50 border-[1px] border-blue-200 rounded-md hidden md:block py-1 px-2 md:px-4 text-blue-500 text-xs">
          Admin
        </div> */}
      </div>
      {message?.type === "error" && <Error err={message?.message} />}
      <div className="flex items-center gap-2 lg:gap-4 relative">
        {/* <button className="p-3 rounded-full text-sm md:text-xl relative">
          {decodedToken?.username}
        </button>  */}

        <div
          className="flex justify-center items-center uppercase cursor-pointer "
          onClick={() => setCloseProfile(!openProfile)}
        >
          <FaRegUserCircle className="lg:w-8 lg:h-8 w-8 h-8" />
        </div>

        {openProfile && (
          <div className="absolute  p-5 shadow-sm right-[-12px] top-[100%] bg-white/100 px-2 z-30 w-44 mt-3 rounded-md capitalize whitespace-pre">
            {userType === "Admin" && <div
              className="text-red-500 flex items-center  gap-2 cursor-pointer hover:bg-orange-400 hover:text-white p-1 rounded"
              onClick={() => {
                navigate("/addadmin");
              }}
            >
              <RiUserAddFill  />
              Add More Admin
            </div>}
            <div
              className="text-red-500 flex items-center  gap-2 cursor-pointer hover:bg-orange-400 hover:text-white p-1 rounded"
              onClick={() => {
                navigate("/update_password");
              }}
            >
              <TbLockPassword />
              Update Password
            </div>
            <div
              className="text-red-500 flex items-center  gap-2 cursor-pointer hover:bg-orange-400 hover:text-white p-1 rounded"
              onClick={() => {
                navigate("/updateProfile");
              }}
            >
              <FaUserEdit  />
              Update Profile
            </div>

            <div
              className="text-red-500 flex items-center  gap-2 cursor-pointer hover:bg-orange-400 hover:text-white p-1 rounded mb-2"
              onClick={logOutHandler}
            >
              <IoPowerSharp />
              logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
