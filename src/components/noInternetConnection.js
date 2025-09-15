import React, { useState, useEffect } from "react";

const NoInternetConnection = () => {
  // State variable holds the state of the internet connection
  const [isOnline, setOnline] = useState(true);

  // On initialization, set the isOnline state based on the navigator's online status
  useEffect(() => {
    setOnline(navigator.onLine);

    // Define event listeners to update the state
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    // Attach the event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup the event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Render a message only if the user is offline
  return !isOnline ? (
    <div
      style={{ borderWidth: 1 }}
      className="z-50 absolute left-1/2 top-2 translate-x-[-50%] font-semibold p-1 px-4 rounded-md text-red-700 bg-red-100 border-red-600"
    >
      No internet connection
    </div>
  ) : null;
};

export default NoInternetConnection;
