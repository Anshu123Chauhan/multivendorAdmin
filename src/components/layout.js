import React, { useMemo, useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import { IoClose } from "react-icons/io5";
import { useUser } from "../config/userProvider";
import "../styles/Admin.css";
import { jwtDecode } from "jwt-decode";
import MobileFooter from "./mobileFooter";

// import { IoClose } from "react-icons/io5";

import { logoUrl } from "../config/config";
import logo from "../assets/logo1.png";
import { getCookie } from "../config/webStorage";
import SearchHeader from "./searchHeader";

const Layout = ({ children }) => {
  const {
    user,
    openProfile,
    setCloseProfile,
    isMenuOpen,
    setIsMenuOpen,
    isSettingOpen,
    setIsSettingOpen,
  } = useUser();

  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const toggleButtonVisibility = () => {
    setIsButtonVisible(!isButtonVisible);
  };

  const token = getCookie("zrotoken");
  const decodedToken = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }, [token]);

  return (
    <div
      className="layout h-screen w-full overflow-hidden bg-black"
      onClick={() => (openProfile === true ? setCloseProfile(false) : null)}
    >
      <SearchHeader />
      <div className="flex gap-2  h-full bg-[#F1F1F1] rounded-xl">
        <div
          className={` sm:relative transition-all duration-500 ease-in-out sm:translate-x-0 z-20 ${
            isMenuOpen
              ? "absolute flex w-3/4 z-20 opacity-100 translate-x-0"
              : "absolute flex w-3/4 sm:w-auto lg:w-[16%] -translate-x-full opacity-0 sm:opacity-100 "
          }    md:flex flex-col  md:relative  gap-4 items-center  h-full px-3 pt-2  shadow-sm bg-[#EBEBEB]`}
        >
          {/* <div
          className={`transition-all duration-500 ease-in-out lg:translate-x-0 ${
            isMenuOpen
              ? "absolute flex w-3/4 z-20 opacity-100 translate-x-0"
              : "absolute flex w-3/4 z-20 opacity-0 -translate-x-full"
          } md:flex flex-col md:relative gap-4 items-center h-full px-3 pt-2 shadow-sm bg-zinc-900 rounded-xl`}
        > */}

          <div className="w-full flex items-center justify-center">
            {/* <img
              className=" h-8 lg:h-10 sm:block md:hidden lg:block"
              src="logo.png"
              alt="logo"
            /> */}

            {/* <img
              src={logoUrl ? logoUrl : logo}
              alt="Logo"
              className="h-10 mb-6"
            /> */}
            {/* <h1 className="font-bold text-3xl text-center text-blue-500">{decodedToken?.userType}</h1> */}
            <div
              className="text-2xl text-white  block md:hidden cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              <IoClose />
            </div>
          </div>
          <Sidebar />
        </div>

        <div className="w-full  lg:w-[85%] flex flex-col overflow-hidden h-full ">
          {isMenuOpen && (
            <div
              className=" block lg:hidden w-full h-full fixed backdrop-blur-[0.2rem] z-10"
              onClick={() => setIsMenuOpen(false)}
            ></div>
          )}
          {/* <Header className=" h-[10%] mb-2" /> */}

          <div
            className=" rounded-xl h-[80%] sm:h-[90%] overflow-auto"
            onClick={() => setCloseProfile(false)}
          >
            {children}
          </div>
          {/* <MobileFooter /> */}
        </div>
      </div>
    </div>
  );
};

export default Layout;

export const Container = ({ children, className, overflow, ...props }) => {
  return (
    <div
      className={`relative rounded-2xl py-2 h-full ${className} ${
        overflow ? overflow : "overflow-hidden"
      }`}
      {...props}
    >
      {children}
    </div>
  );
};
