import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { BiSolidDashboard, BiSolidOffer } from "react-icons/bi";
import { MdOutlineCategory } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import { RiServiceLine, RiShoppingCart2Line } from "react-icons/ri";
import { CiCreditCard2, CiFilter } from "react-icons/ci";
import { useUser } from "../config/userProvider";
import { useLayout } from "../config/layoutContext";
import { IoIosImages, IoIosPeople } from "react-icons/io";
import { IoAppsSharp, IoSettingsOutline } from "react-icons/io5";
import { PiArrowBendDownRightLight } from "react-icons/pi";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { GoImage } from "react-icons/go";
import { IoVideocamSharp } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../config/webStorage";
import "../../src/App.css";

const Sidebar = () => {
  const { isMenuOpen, setIsMenuOpen, permissions } = useUser();
  const { setIsSettingOpen } = useLayout();
  const [filteredMenu, setFilteredMenu] = useState([]);
const token = getCookie("zrotoken");
  const navigate = useNavigate();
  const location = useLocation().pathname;

  // Decode token only when it changes
const decodedToken = useMemo(() => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}, [token]);


  useEffect(() => {
     const NavigationData = {
    superadmin: [
      { title: "Dashboard", icon: <BiSolidDashboard />, location: "/dashboard", permission: "dashboard" },
      { title: "Seller", icon: <BiSolidDashboard />, location: "/sellerList", permission: "sellerList" },
      { title: "User", icon: <BiSolidDashboard />, location: "/userlist" },
      { title: "Category", icon: <MdOutlineCategory />, location: "/category", permission: "catgory" },
      { title: "Sub Category", icon: <BiCategoryAlt />, location: "/subcategory", permission: "subcatgory" },
      { title: "Brand", icon: <MdOutlineCategory />, location: "/brand", permission: "brand" },
      // { title: "Attribute", icon: <MdOutlineCategory />, location: "/attribute", permission: "attribute" },

      { title: "Product", icon: <RiServiceLine />, location: "/product" },

      { title: "Services", icon: <RiServiceLine />, location: "/service" },
      { title: "Filter", icon: <CiFilter />, location: "/filter", permission: "filter" },
      { title: "Banner", icon: <IoIosImages />, location: "/banner", permission: "banner" },
      { title: "customers", icon: <IoIosPeople />, location: "/customer", permission: "customer" },
      {
        title: "orders",
        icon: <RiShoppingCart2Line />,
        location: "/orders",
        permission: "order_manage",
        // submenu: [
          //   { title: "Abandoned checkouts", icon: <IoIosPeople />, location: "/orders/abandoned" },
          // ],
        },
        { title: "settings", icon: <IoSettingsOutline />, location: "/settings", permission: "settings" },
      // { title: "Price Code", icon: <LiaRupeeSignSolid />, location: "/pricemapping", permission: "customers" },
      // { title: "Image Mapping", icon: <GoImage />, location: "/imagemapping", permission: "customers" },
      // { title: "Video Mapping", icon: <IoVideocamSharp />, location: "/videomapping", permission: "customers" },
      // { title: "Analytics", icon: <IoAppsSharp />, location: "/analytics", permission: "analysis" },
      // { title: "Abandoned Checkout", icon: <BiSolidOffer />, location: "/abandoned" },
      // { title: "coupons", icon: <CiCreditCard2 />, location: "/coupons", permission: "coupons" },
    ],
  };
  
    let menu = NavigationData.superadmin;
    if (decodedToken?.userType === "Admin") {
      menu = NavigationData.superadmin
    }
   
    if (decodedToken?.userType === "Seller") {
      const exclude = ["Seller", "Category", "Sub Category", "Brand", "Filter","Banner", "settings"];
      menu = menu.filter((item) => !exclude.includes(item.title));
    }

  if (decodedToken?.userType === "User") {
    const userPermissions = Array.isArray(decodedToken?.permission) ? decodedToken.permission : [];
    const allowedTabs = new Set(
      userPermissions.filter((p) => p.p_read).map((p) => p.tab_name.toLowerCase())
    );
    menu = menu.filter((item) => {
      if (item.title.toLowerCase() === "dashboard") return true;
      if (!item.permission) return allowedTabs.has(item.title.toLowerCase());
      return allowedTabs.has(item.permission.toLowerCase());
    });
  }


    setFilteredMenu(menu);
  }, [decodedToken, permissions]);

  const MenuDiv = ({ children, color, className, onClick, backgroundColor }) => (
    <div
      className={`flex items-center gap-1.5 ${className}`}
      style={{ color: color || "", backgroundColor: backgroundColor || "" }}
      onClick={onClick}
    >
      {children}
    </div>
  );

  const MenuItems = ({ icon, title }) => (
    <>
      <span className="text-2xl">{icon}</span>
      <p className="sm:hidden lg:block text-sm capitalize">{title}</p>
    </>
  );

  return (
    <div className="flex flex-col justify-between w-full h-full overflow-scroll scroll-smooth hide-scrollbar py-2">
      <div className="flex flex-col items-start w-full h-full">
        {filteredMenu.map((item, index) => (
          <div key={index} className="flex flex-col w-full my-1">
            <NavLink
              onClick={() => isMenuOpen && setIsMenuOpen(false)}
              className={({ isActive }) => `
                px-2 py-1.5 rounded-lg w-full border-none font-medium capitalize transition-all duration-300
                ${isActive ? "bg-[#ECF3FF] text-[#465fff]" : "hover:bg-[#ECF3FF] text-[#344054]"}
              `}
              to={item?.location}
            >
              <MenuDiv>
                <MenuItems icon={item?.icon} title={item?.title} />
              </MenuDiv>
            </NavLink>

            {/* Submenu */}
            {item?.location &&
              location.includes(item?.location) &&
              Array.isArray(item?.submenu) &&
              item.submenu.length > 0 && (
                <div className="pl-6">
                  {item.submenu.map((subitem, subIndex) => (
                    <NavLink to={subitem?.location} key={subIndex}>
                      <MenuDiv
                        color={location.includes(subitem?.location) ? "#fff" : "#000"}
                        backgroundColor={location.includes(subitem?.location) ? "#ff611695" : ""}
                        className="border border-transparent hover:border-orange-300 hover:text-orange-500 cursor-pointer my-2 p-1 rounded-md relative group"
                      >
                        <PiArrowBendDownRightLight
                          className={`text-orange-600 absolute right-full mr-1 ${
                            location.includes(subitem?.location) ? "block" : "hidden"
                          }`}
                        />
                        <MenuItems icon={subitem?.icon} title={subitem?.title} />
                      </MenuDiv>
                    </NavLink>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>

      {/* <NavLink to={"/settings"}>
        <button
          onClick={() => setIsSettingOpen(true)}
          className="text-black px-2 py-2 rounded-lg w-full flex items-center gap-1.5 border-transparent capitalize text-sm border hover:border-orange-300 hover:text-orange-500 mt-12 mb-4"
        >
          <div className="flex gap-2">
            <IoSettingsOutline className="text-xl" /> Settings
          </div>
        </button>
      </NavLink> */}
    </div>
  );
};

export default Sidebar;
