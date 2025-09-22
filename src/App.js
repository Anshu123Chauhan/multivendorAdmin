import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import Routers from "./routes";
import NoInternetConnection from "./components/noInternetConnection";
import { useUser } from "./config/userProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InstallPWA from "./config/installPwa";

import { Helmet } from "react-helmet";
import { headerTitle, headerLogoUrl } from "./config/config";

function App() {
  const { showInternetStatus } = useUser();
  const [pageTitle, setPageTitle] = useState(
    headerTitle ? headerTitle : "ENS Marketplace"
  );

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <React.Fragment>
      {/* Toast notifications */}
      <Helmet>
        <title>{pageTitle}</title>
        <link
          rel="icon"
          href={
            headerLogoUrl
              ? headerLogoUrl
              : "https://ondc-marketplace.s3.amazonaws.com/image/1c90c345-5d0b-444f-beb2-677520a7d482.png"
          }
        />
      </Helmet>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      {/* Internet connection alert */}
      <NoInternetConnection />
      {showInternetStatus && (
        <div className="z-50 absolute left-1/2 top-2 translate-x-[-50%] font-semibold p-1 px-4 rounded-md text-red-700 bg-red-100 border-red-600">
          Network disconnect
        </div>
      )}
      <Routers />
    </React.Fragment>
  );
}

export default App;
