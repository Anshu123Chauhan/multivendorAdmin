import React from "react";
import { BiSearch } from "react-icons/bi";
import Input from "./inputContainer";

const SearchContainer = ({ ...props }) => {
  return (
    <div className="w-full flex items-center relative group">
      <div className="flex items-center w-full">
        <Input.normal
          type="text"
          className="text-xs sm:text-base"
          // placeholder="Global Search...."
          // className="lg:base text-xs py-2 w-full hover:border-gray-500 transition duration-200 pr-10"
          {...props}
        />
        {/* <BiSearch className="text-xl absolute right-3 top-1/2 -translate-y-1/2 group-hover:text-black text-zinc-300 transition duration-200" /> */}
        <BiSearch className="text-xl  -mx-8 group-hover:text-black text-zinc-300 transition duration-200" />
      </div>
    </div>
  );
};

export default SearchContainer;
