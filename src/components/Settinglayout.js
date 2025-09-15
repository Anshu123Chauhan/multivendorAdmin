import React, { useEffect } from "react";
import { useLayout } from "../config/layoutContext";
import Card from "./card";
import { IoClose } from "react-icons/io5";
import Layout from "./layout";
import { useNavigate } from "react-router-dom";
import SettingSidebar from "./settingSidebar";

function SettingLayout({ children }) {
  const { isSettingOpen, setIsSettingOpen, isSettingRoute } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    // Update only if the state actually changes to prevent unnecessary re-renders
    if (isSettingOpen !== isSettingRoute) {
      setIsSettingOpen(isSettingRoute);
    }
  }, [isSettingRoute, isSettingOpen, setIsSettingOpen]);

  return (
    <Layout>
      <Card.AddPopUp
        // cardtransition={{ duration: 0.05, ease: "easeInOut" }}
        // cardinitial={{ y: "100%" }}
        cardanimate={isSettingOpen ? { y: 0 } : { y: "100%" }}
        width="w-[100%] h-[97%]"
        removePopUp={() => setIsSettingOpen(false)}
        containerStyle={{ alignItems: "end" }}
        ClassName={`rounded-b-none rounded-[40px] pb-0 absolute bottom-0 transition-all duration-700 ease-in-out ${
          // isSettingOpen ? "bottom-0" : "-bottom-[90%]"
          ""
        } `}
      >
        {/* Header */}
        <div className="flex justify-between h-10 items-center px-3 -mt-3 mb-3 border-b">
          <div className="text-xl font-bold text-orange-600">Setting</div>
          <button
            className="hover:bg-zinc-50 p-2 rounded-md"
            onClick={() => navigate("/dashboard")}
          >
            <IoClose />
          </button>
        </div>

        {/* Layout Content */}
        <div className="flex gap-4 md:gap-0 mt-3 justify-center h-[calc(100%-40px)] overflow-hidden">
          <SettingSidebar />
          <div className="max-w-[55%] w-[55%] bg-gray-50/50 px-4 pt-2 rounded-lg overflow-hidden">
            {children}
          </div>
        </div>
      </Card.AddPopUp>
    </Layout>
  );
}

export default SettingLayout;
