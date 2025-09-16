import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

const BackHeader = ({ backButton, link, title, rightSide, leftSide }) => {
  return (
    <div className="flex sm:justify-between flex-wrap items-center gap-5 w-full">
      <div className="flex  items-center gap-5 ">
        {backButton === true && (
          <Link to={link}>
            <div className="flex items-center justify-center border border-slate-200 rounded-md w-8 h-8 cursor-pointer hover:bg-gray-200 transition-all duration-300 shadow">
              <IoMdArrowRoundBack className="text-slate-500" />
            </div>
          </Link>
        )}
        {leftSide && (
          <div
            className="flex items-center justify-center border border-slate-300 rounded-md w-8 h-8 cursor-pointer"
            onClick={leftSide}
          >
            <IoMdArrowRoundBack className="text-slate-500 text-lg" />
          </div>
        )}
        <h2 className="capitalize text-lg md:text-2xl text-center text-slate-500 font-bold">
          {title}
        </h2>
      </div>
      {rightSide}
    </div>
  );
};

export default BackHeader;
