import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useUser } from "../config/userProvider";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { CiWallet } from "react-icons/ci";
import { TbWorldWww } from "react-icons/tb";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlinePrivacyTip, MdOutlinePolicy } from "react-icons/md";
import { FaGooglePlusG } from "react-icons/fa6";
import { FaRegImages } from "react-icons/fa6";

const SettingSidebar = () => {
  const { currentLocation, setCurrentLocation, permissions } = useUser();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    {
      name: "General",
      path: "/settings/generalSettings",
      icon: <IoSettingsOutline />,
    },
    {
      name: "Users and Permissions",
      path: "/settings/permission",
      icon: <FaUsers />,
      permission: "user&permissions",
    },
    {
      name: "Payments",
      path: "/settings/payments",
      icon: <CiWallet />,
      permission: "payments",
    },
    { name: "Domains", path: "/settings/domains", icon: <TbWorldWww /> },
    {
      name: "Notifications",
      path: "/settings/notifications",
      icon: <IoMdNotificationsOutline />,
      permission: "notifications",
    },
    {
      name: "G-credentials",
      path: "/settings/g-credentials",
      icon: <FaGooglePlusG />,
      permission: "gcredentials",
    },
    {
      name: "Banner",
      path: "/settings/bannersettings",
      icon: <FaRegImages />,
      permission: "banner",
    },
    // { name: "Customer Privacy", path: "/settings/privacy", icon: <MdOutlinePrivacyTip /> },
    // { name: "Policy", path: "/settings/policy", icon: <MdOutlinePolicy /> },
  ];

  const location = useLocation().pathname;

  useEffect(() => {
    setCurrentLocation(location);
  }, [location, setCurrentLocation]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Burger Menu */}
      <div className="md:hidden h-auto p-4 flex items-center justify-between drop-shadow lg:static absolute  left-[6%] top-[12%] transform -translate-x-1/2 -translate-y-1/2 top-12 w-min left-0 right-0 z-50">
        <button onClick={toggleSidebar}>
          <IoMdMenu className="text-2xl text-orange-500" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white  p-4 transition-transform transform  ${
          isSidebarOpen ? "translate-x-0 md:h-6" : "-translate-x-full"
        } md:translate-x-0 md:static md:w-72 z-50`}
      >
        <nav className="space-y-1">
          {links.map(
            (link, index) => (
              // permissions?.[link?.permission]?.read && (
              <NavLink
                key={index}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md hover:border-orange-500 border border-transparent ${
                    isActive
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "text-gray-500"
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <div>{link.icon}</div>
                  <div>{link.name}</div>
                </div>
              </NavLink>
            )
            // )
          )}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
        ></div>
      )}
    </>
  );
};

export default SettingSidebar;
