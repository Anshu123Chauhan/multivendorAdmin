import React from "react";
import { BiSearch } from "react-icons/bi";

const normal = ({
  labelClassName,
  label,
  containerWidth,
  className,
  isInput,
  ...props
}) => {
  return (
    <div
      className={`flex flex-col ${containerWidth ? containerWidth : "w-full"} `}
    >
      {label && (
        <label
          className={`font-medium text-xs md:text-sm pl-3 text-slate-500 ${labelClassName}`}
          htmlFor={label}
        >
          {label}
        </label>
      )}
      {isInput === false ? (
        ""
      ) : (
        <input
          className={`w-full border border-slate-300 px-3 py-2.5 rounded-lg focus:outline-none bg-white ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

const textArea = ({
  labelClassName,
  label,
  containerWidth,
  className,
  isInput,
  ...props
}) => {
  return (
    <div
      className={`flex flex-col ${containerWidth ? containerWidth : "w-full"} `}
    >
      {label && (
        <label
          className={`font-medium text-xs md:text-sm pl-3 text-slate-500 ${labelClassName}`}
          htmlFor={label}
        >
          {label}
        </label>
      )}
      {isInput === false ? (
        ""
      ) : (
        <textarea
          className={`w-full border border-slate-300 px-3 py-2.5 rounded-lg focus:outline-none bg-white ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

const search = ({ ...props }) => {
  return (
    <div className="flex items-center relative group w-full">
      <div className="flex items-center w-full">
        <Input.normal type="text" className="text-xs sm:text-base" {...props} />
        {/* <BiSearch className="text-xl absolute right-3 top-1/2 -translate-y-1/2 group-hover:text-black text-zinc-300 transition duration-200" /> */}
        <BiSearch className="text-xl  -mx-8 group-hover:text-black text-zinc-300 transition duration-200" />
      </div>
    </div>
  );
};

const Input = { textArea, normal, search };

export default Input;



