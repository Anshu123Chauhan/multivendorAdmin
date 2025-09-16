import React, { useEffect, useState } from "react";
import { Route, Navigate } from "react-router-dom";
import axios from "axios";
import { validateToken } from "./validateToken.js";
import { getCookie } from "./webStorage.js";
import { useUser } from "./userProvider.js";

const ProtectedRoute = ({ element: Element, PermissionName }) => {
  const { setUser, permissions } = useUser();
  const [isValidated, setIsValidated] = useState(true);
  const [loading, setLoading] = useState(false);

  // Remove the comment and setIsValidated  to false to remove BYPASS

  useEffect(() => {
    const token = getCookie("zrotoken");
    //console.log("token", token);

    if (!token) {
      window.location.href = "/";
    }

    // validateToken(token)
    //   .then((user) => {
    //     if (
    //       user?.success === true &&
    //       user.user?.permissions[PermissionName]?.read
    //     ) {
    //       setIsValidated(true);
    //       setUser(user.user);
    //     } else {
    //       setIsValidated(false);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Token validation failed:", error);
    //     setIsValidated(false);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  }, []);

  if (loading) {
    return (
      <div>
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white/100 p-6 rounded shadow-lg text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-800">Verifying...</p>
          </div>
        </div>
      </div>
    );
  }

  return isValidated ? Element : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
