import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../config/webStorage";

export const usePermission = () => {
  const [permission, setPermission] = useState([]);
  const [userType, setUserType] = useState();

  useEffect(() => {
    const token = getCookie("zrotoken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const perms = Array.isArray(decoded.permission) ? decoded.permission : [];
      setPermission(perms);
      setUserType(decoded?.userType);
    } catch (err) {
      console.error("Invalid token:", err);
      setPermission([]);
    }
  }, []);

  return { permission, userType };
};
