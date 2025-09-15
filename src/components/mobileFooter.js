import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const MobileFooter = () => {
  return (
    <div className="footerFixedNav fixed bottom-0 w-full bg-[#fff] px-4 py-1 flex justify-between items-center sm:hidden border-t">
    <NavLink
      activeclassname="active"
      className="flex items-center flex-col cursor-pointer m-1 p-1 rounded-md hover:font-[600]"
      to="/dashboard"
    >
      <svg
        width="30"
        height="30"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <path d="M22 11.414v12.586h-20v-12.586l-1.293 1.293-.707-.707 12-12 12 12-.707.707-1.293-1.293zm-6 11.586h5v-12.586l-9-9-9 9v12.586h5v-9h8v9zm-1-7.889h-6v7.778h6v-7.778z"></path>
      </svg>

      <span className="text-xs">Home</span>
    </NavLink>
    <NavLink
      activeclassname="active"
      className="flex items-center flex-col cursor-pointer m-1 p-1 rounded-md hover:font-[600]"
      to="/createcatalog"
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" fill="none" width="20" height="20"></rect>
        <g>
          <path d="M5.7 9c.4-2 2.2-3.5 4.3-3.5 1.5 0 2.7.7 3.5 1.8l1.7-2C14 3.9 12.1 3 10 3 6.5 3 3.6 5.6 3.1 9H1l3.5 4L8 9H5.7zm9.8-2L12 11h2.3c-.5 2-2.2 3.5-4.3 3.5-1.5 0-2.7-.7-3.5-1.8l-1.7 1.9C6 16.1 7.9 17 10 17c3.5 0 6.4-2.6 6.9-6H19l-3.5-4z"></path>
        </g>
      </svg>

      <span className="text-xs">Catalog</span>
    </NavLink>
    <NavLink
      activeclassname="active"
      className="flex items-center flex-col cursor-pointer m-1 p-1 rounded-md hover:font-[600]"
      to="/orders"
    >
      <svg
        width="30"
        height="30"
        clipRule="evenodd"
        fillRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m2.394 15.759s7.554 4.246 9.09 5.109c.165.093.333.132.492.132.178 0 .344-.049.484-.127 1.546-.863 9.155-5.113 9.155-5.113.246-.138.385-.393.385-.656 0-.566-.614-.934-1.116-.654 0 0-7.052 3.958-8.539 4.77-.211.115-.444.161-.722.006-1.649-.928-8.494-4.775-8.494-4.775-.502-.282-1.117.085-1.117.653 0 .262.137.517.382.655zm0-3.113s7.554 4.246 9.09 5.109c.165.093.333.132.492.132.178 0 .344-.049.484-.127 1.546-.863 9.155-5.113 9.155-5.113.246-.138.385-.393.385-.656 0-.566-.614-.934-1.116-.654 0 0-7.052 3.958-8.539 4.77-.211.115-.444.161-.722.006-1.649-.928-8.494-4.775-8.494-4.775-.502-.282-1.117.085-1.117.653 0 .262.137.517.382.655zm10.271-9.455c-.246-.128-.471-.191-.692-.191-.223 0-.443.065-.675.191l-8.884 5.005c-.276.183-.414.444-.414.698 0 .256.139.505.414.664l8.884 5.006c.221.133.447.203.678.203.223 0 .452-.065.689-.203l8.884-5.006c.295-.166.451-.421.451-.68 0-.25-.145-.503-.451-.682zm-8.404 5.686 7.721-4.349 7.72 4.349-7.72 4.35z"
          fillRule="nonzero"
        ></path>
      </svg>

      <span className="text-xs">Orders</span>
    </NavLink>
    <NavLink
      activeclassname="active"
      className="flex items-center flex-col cursor-pointer m-1 p-1 rounded-md hover:font-[600]"
      to="/account"
    >
      <svg
        width="30"
        height="30"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <path d="M12 0c-5.083 0-8.465 4.949-3.733 13.678 1.596 2.945-1.725 3.641-5.09 4.418-3.073.709-3.187 2.235-3.177 4.904l.004 1h23.99l.004-.969c.012-2.688-.093-4.223-3.177-4.935-3.438-.794-6.639-1.49-5.09-4.418 4.719-8.912 1.251-13.678-3.731-13.678m0 1c1.89 0 3.39.764 4.225 2.15 1.354 2.251.866 5.824-1.377 10.06-.577 1.092-.673 2.078-.283 2.932.937 2.049 4.758 2.632 6.032 2.928 2.303.534 2.412 1.313 2.401 3.93h-21.998c-.01-2.615.09-3.396 2.401-3.93 1.157-.266 5.138-.919 6.049-2.94.387-.858.284-1.843-.304-2.929-2.231-4.115-2.744-7.764-1.405-10.012.84-1.412 2.353-2.189 4.259-2.189"></path>
      </svg>

      <span className="text-xs">Account</span>
    </NavLink>
  </div>
  );
};

export default MobileFooter;