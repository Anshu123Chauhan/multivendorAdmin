import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { SiGoogleanalytics } from "react-icons/si";
import { MdOutlineCategory } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import { BiSolidUser } from "react-icons/bi";
import { IoIosImages } from "react-icons/io";
import { RiSettings4Fill } from "react-icons/ri";
import { PiArrowBendDownRightLight } from "react-icons/pi";
import { useUser } from "../config/userProvider";
import { useLayout } from "../config/layoutContext";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../config/webStorage";
import "../../src/App.css";
import { IoIosArrowUp } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TbCategoryPlus } from "react-icons/tb";



const Sidebar = () => {
  const { isMenuOpen, setIsMenuOpen, permissions } = useUser();
  const { setIsSettingOpen } = useLayout();
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null); // Fixed: no 'number' type
  const token = getCookie("zrotoken");
  const location = useLocation().pathname;

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
        {
          title: "Analytics",
          icon: <SiGoogleanalytics />,
          location: "/dashboard",
          permission: "dashboard",
        },
        {
          title: "Vendor",
          icon: <FaUsers />,
          submenu: [
            {
              title: "Manage Vendor",
              icon: <FaUsers />,
              location: "/sellerList",
              permission: "sellerList",
            },
            {
              title: "Manage Category",
              icon: <TbCategoryPlus />,
              location: "/managevender",
            },
          ],
        },
        {
          title: "User",
          icon: (
            <img
              src="http://res.cloudinary.com/dv5del8nh/image/upload/v1761648460/fapd8dqq5j3ircgt4uqy.png"
              alt="user"
            />
          ),
          location: "/userlist",
        },
        {
          title: "Category",
          icon: <MdOutlineCategory />,
          location: "/category",
          permission: "catgory",
        },
        {
          title: "Sub Category",
          icon: <BiCategoryAlt />,
          location: "/subcategory",
          permission: "subcatgory",
        },
        {
          title: "Brand",
          icon: (
            <img
              src="http://res.cloudinary.com/dv5del8nh/image/upload/v1761649264/r12diwccvmpwdaukmybn.png"
              alt="brand"
            />
          ),
          location: "/brand",
          permission: "brand",
        },
        {
          title: "Product",
          icon: (
            <img
              src="http://res.cloudinary.com/dv5del8nh/image/upload/v1761648357/lsk6qwd2oyx3bloiztvd.png"
              alt="product"
            />
          ),
          location: "/product",
        },
        {
          title: "Banner",
          icon: <IoIosImages />,
          location: "/banner",
          permission: "banner",
        },
        {
          title: "Customers",
          icon: <BiSolidUser />,
          location: "/customer",
          permission: "customer",
        },
        {
          title: "Order",
          icon: (
            <img
              src="http://res.cloudinary.com/dv5del8nh/image/upload/v1761648549/yrgcasskodidwbfyexth.png"
              alt="order"
            />
          ),
          location: "/orders",
          permission: "order",
        },
      ],
    };

    let menu = NavigationData.superadmin;

    if (decodedToken?.userType === "Admin") {
      menu = NavigationData.superadmin;
    }

    if (decodedToken?.userType === "Seller") {
      const exclude = [
        "Seller",
        "Category",
        "Sub Category",
        "Brand",
        "Filter",
        "Banner",
        "settings",
      ];
      menu = menu.filter((item) => !exclude.includes(item.title));
    }

    if (decodedToken?.userType === "User") {
      const userPermissions = Array.isArray(decodedToken?.permission)
        ? decodedToken.permission
        : [];
      const allowedTabs = new Set(
        userPermissions
          .filter((p) => p.p_read)
          .map((p) => p.tab_name.toLowerCase())
      );

      const filterItem = (item) => {
        if (item.title.toLowerCase() === "dashboard") return true;
        if (item.submenu) {
          const filteredSub = item.submenu.filter((sub) => {
            if (!sub.permission) return true;
            return allowedTabs.has(sub.permission.toLowerCase());
          });
          return filteredSub.length > 0 ? { ...item, submenu: filteredSub } : null;
        }
        if (!item.permission) return allowedTabs.has(item.title.toLowerCase());
        return allowedTabs.has(item.permission.toLowerCase());
      };

      menu = menu.map(filterItem).filter((item) => item !== null);
    }

    setFilteredMenu(menu);
  }, [decodedToken, permissions]);

  const MenuDiv = ({ children, className, onClick }) => (
    <div
      className={`flex items-center gap-1.5 ${className ?? ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );

  const MenuItems = ({ icon, title }) => (
    <>
      <span className="text-md">{icon}</span>
      <p className="sm:hidden lg:block text-sm capitalize">{title}</p>
    </>
  );

  return (
    <div className="flex flex-col justify-between w-full h-full overflow-scroll scroll-smooth hide-scrollbar py-2">
      <div className="flex flex-col items-start w-full h-full">
        <div className="flex flex-col items-start w-full h-[calc(90vh-60px)]">
          {filteredMenu.map((item, index) => (
            <div key={index} className="flex flex-col w-full my-0.5">
              {item.submenu ? (
                <div>
                  <div
                    onClick={() =>
                      setOpenDropdown(openDropdown === index ? null : index)
                    }
                    className={`
                      px-2 py-1 rounded-lg w-full font-medium capitalize transition-all duration-300 cursor-pointer flex items-center
                      ${openDropdown === index
                        ? "bg-white text-black"
                        : "hover:bg-[#f1f2f3] text-[#344054]"
                      }
                    `}
                  >
                    <MenuDiv>
                      <MenuItems icon={item.icon} title={item.title} />
                      <span className="ml-auto text-xs">
                        {openDropdown === index ? <MdKeyboardArrowDown /> : <IoIosArrowUp />}
                      </span>
                    </MenuDiv>
                  </div>

                  {openDropdown === index && (
                    <div className="pl-6 mt-1">
                      {item.submenu.map((sub, subIdx) => (
                        <NavLink
                          key={subIdx}
                          to={sub.location}
                          onClick={() => isMenuOpen && setIsMenuOpen(false)}
                          className={({ isActive }) => `
                            block px-3 py-1.5 my-1 rounded-md text-sm transition-all flex items-center
                            ${isActive
                              ? "bg-white-100 font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                            }
                          `}
                        >
                          <MenuDiv>
                            <MenuItems icon={sub.icon} title={sub.title} />
                          </MenuDiv>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.location}
                  onClick={() => isMenuOpen && setIsMenuOpen(false)}
                  className={({ isActive }) => `
                    px-2 py-1 rounded-lg w-full font-medium capitalize transition-all duration-300 flex items-center
                    ${isActive
                      ? "bg-white text-black"
                      : "hover:bg-[#f1f2f3] text-[#344054]"
                    }
                  `}
                >
                  <MenuDiv>
                    <MenuItems icon={item.icon} title={item.title} />
                  </MenuDiv>
                </NavLink>
              )}
            </div>
          ))}
        </div>

        <NavLink
          to="/settings"
          className={({ isActive }) => `
            px-2 py-1 rounded-lg w-full font-medium capitalize transition-all duration-300 flex items-center
            ${isActive
              ? "bg-white text-black"
              : "hover:bg-[#f1f2f3] text-[#344054]"
            }
          `}
        >
          <div className="flex gap-2 items-center">
            <RiSettings4Fill className="text-lg" />
            <p className="sm:hidden lg:block text-sm capitalize mb-0.5">
              Settings
            </p>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;