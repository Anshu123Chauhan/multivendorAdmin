
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { UserProvider } from "./config/userProvider";
import { BrowserRouter } from "react-router-dom";
import { LayoutProvider } from "./config/layoutContext";

const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <LayoutProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </LayoutProvider>
    </BrowserRouter>
  </React.StrictMode>
);


