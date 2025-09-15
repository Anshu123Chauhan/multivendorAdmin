import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiurl } from "./config";
import { useLocation } from "react-router-dom";
import { getCookie } from "./webStorage.js";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [storeData, setStoreData] = useState("");
  const [openProfile, setCloseProfile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [permissions, setPermissions] = useState(false);
  const [isPersonalize, setIsPersonalize] = useState(true);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const setUser = (user) => {
    setUserData(user);
  };
  const token = getCookie("zrotoken");

  useEffect(() => {
    setPermissions(userData?.permissions);

  
  }, [userData]);

  const [showInternetStatus, setShowInternetStatus] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
  useEffect(() => {
    if (!navigator.onLine) {
      setShowInternetStatus(true);
    } else {
      setTimeout(() => {
        setShowInternetStatus(false);
      }, 10000);
    }
  }, [navigator.onLine]);

  return (
    <UserContext.Provider
      value={{
        token,
        userData,
        setUser,
        storeData,
        setStoreData,
        openProfile,
        setCloseProfile,
        isMenuOpen,
        setIsMenuOpen,
        permissions,
        setPermissions,
        showInternetStatus,
        isPersonalize,
        setIsPersonalize,
        isSettingOpen,
        setIsSettingOpen,
        currentLocation,
        setCurrentLocation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
