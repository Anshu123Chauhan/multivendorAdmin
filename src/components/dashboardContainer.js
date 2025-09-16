import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import "./layout.css";
import Hamburger from "./burger-menu-svgrepo-com.svg";
import Close from "./close-svgrepo-com.svg";
import { BiSolidDashboard } from "react-icons/bi";
import { FaRegFolder, FaUserPlus } from "react-icons/fa6";
import { TbViewfinder } from "react-icons/tb";
import { FaUsersViewfinder } from "react-icons/fa6";
import { IoAnalyticsOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { GrSync } from "react-icons/gr";
import { PiFilePdfLight } from "react-icons/pi";
import { RiEdit2Line } from "react-icons/ri";
import { MdOutlineCelebration } from "react-icons/md";
import { useUser } from "../config/userProvider";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";

const Layout = ({ children }) => {
  const { user, setCloseProfile, isMenuOpen, setIsMenuOpen } = useUser();

  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const toggleButtonVisibility = () => {
    setIsButtonVisible(!isButtonVisible);
  };
  console.warn("==>");

  const NavTitles = {
    admin: [
      {
        title: "Dashboard",
        icon: <BiSolidDashboard />,
        location: "/",
      },

      {
        title: "Stores",
        icon: <TbViewfinder />,
        location: "/admin/stores",
      },
      {
        title: "View User",
        icon: <FaUsersViewfinder />,
        location: "/admin/viewuser",
      },
      {
        title: "Analytics",
        icon: <IoAnalyticsOutline />,
        location: "/admin/analytics",
      },
      {
        title: "Files",
        icon: <FaRegFolder />,
        location: "/admin/files",
      },
      {
        title: "Create category",
        icon: <BiCategoryAlt />,
        location: "/admin/create-category",
      },
      {
        title: "sync products",
        icon: <GrSync />,
        location: "/admin/sync-products",
      },
      {
        title: "pdf tamplate",
        icon: <PiFilePdfLight />,
        location: "/admin/sync-products",
      },
      {
        title: "image editor",
        icon: <RiEdit2Line />,
        location: "/admin/image-editor",
      },
      {
        title: "celebration",
        icon: <MdOutlineCelebration />,
        location: "/admin/celebration",
      },
    ],
    user: [
      // Store
      {
        title: "dashboard",
        icon: <MdOutlineCelebration />,
        location: "/",
      },
      {
        title: "create catalog",
        icon: <MdOutlineCelebration />,
        location: "/createcatalog",
      },
      {
        title: "user profile",
        icon: <MdOutlineCelebration />,
        location: "/userprofile",
      },
    ],
  };

  return (
    <div className="layout h-screen w-full overflow-hidden bg-zinc-50">
      <div className="flex gap-3  h-full p-2">
        {/* header */}

        <div
          className={`${
            isMenuOpen ? "absolute flex w-11/12 z-10 " : "hidden w-[15%]"
          }    md:flex flex-col  md:relative  gap-4 items-center  h-full px-3  pt-2  shadow-sm bg-[#353a40] rounded-xl `}
        >
          {/* <div className="w-full px-2"> */}
          <div
            className="absolute right-4 top-4 text-2xl text-white block md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <IoClose />
          </div>
          <img className="h-10" src="/logo.png" alt="logo" />
          {/* </div> */}
          <div className="flex flex-col gap-1 items-center w-full">
            {user &&
              NavTitles[user?.permission.role].map((item, index) => {
                return (
                  <NavLink
                    key={index}
                    style={{ borderWidth: 1 }}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) => `
              px-2 py-2 rounded-lg w-full  flex items-center gap-1.5
                border-transparent hover:border-[#353a40] capitalize
                text-sm
             ${
               isActive
                 ? " bg-white/100 text-[#353a40]"
                 : "hover:border hover:border-white hover:text-white text-white"
             }  
              `}
                    to={item.location}
                  >
                    <span className="text-xl"> {item?.icon}</span>
                    <p>{item.title}</p>
                  </NavLink>
                );
              })}
          </div>
        </div>

        <div className="w-full md:w-[85%] flex flex-col   overflow-hidden h-full ">
          <Header />
          <div
            className="bg- rounded-xl h-full"
            onClick={() => setCloseProfile(false)}
          >
            <main role="main" className="h-full overflow-y-scroll">
              {children}
            </main>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
