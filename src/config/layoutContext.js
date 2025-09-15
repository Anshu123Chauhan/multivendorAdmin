import { createContext, useContext, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";

// Create Context
const LayoutContext = createContext();

// Context Provider
export function LayoutProvider({ children }) {
  const location = useLocation();
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  // Memoize setting visibility to prevent unnecessary re-renders
  const isSettingRoute = useMemo(
    () => location.pathname.includes("settings"),
    [location.pathname]
  );

  return (
    <LayoutContext.Provider
      value={{ isSettingOpen, setIsSettingOpen, isSettingRoute }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

// Custom Hook to use Layout Context
export function useLayout() {
  return useContext(LayoutContext);
}
