import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../config/webStorage";

export const usePermission = () => {
  const [permission, setPermission] = useState([]);
  const [userType, setUserType] = useState();
  const [userName, setUSerName] = useState();
  const [userId, setUSerId] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();

  useEffect(() => {
    const token = getCookie("zrotoken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const permissionTab = Array.isArray(decoded.permission)
        ? decoded.permission
        : [];
      setPermission(permissionTab);
      setUserType(decoded?.userType);
      setUSerName(decoded?.fullName);
      setUSerId(decoded?._id);
      setEmail(decoded?.email);
      setPhone(decoded?.phone);
    } catch (err) {
      console.error("Invalid token:", err);
      setPermission([]);
    }
  }, []);

  return { permission, userType, userName, userId, email, phone };
};
