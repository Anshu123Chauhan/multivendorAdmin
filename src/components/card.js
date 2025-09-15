import React from "react";
import { GoDot } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import { motion } from "motion/react";

const AddPopUp = ({
  children,
  removePopUp,
  Background,
  ClassName,
  width,
  containerClassName,
  containerStyle,
  cardStyle,
  animate,
  transition,
  initial,
  whileInView,cardanimate,cardtransition,cardinitial,cardwhileInView
}) => {
  return (
    <motion.div
      animate={animate}
      transition={transition}
      initial={initial}
      whileInView={whileInView}
      className={`fixed inset-0 flex items-center justify-center z-50  transition-all duration-700 ease-in-out   ${containerClassName}`}
      style={containerStyle}
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/50" // Increased opacity for better overlay
        onClick={removePopUp}
      ></div>

      {/* Popup container */}
      <motion.div
        animate={cardanimate}
        transition={cardtransition}
        initial={cardinitial}
        whileInView={cardwhileInView}
        className={`relative z-60    w-11/12 rounded-xl p-4 overflow-auto  ${
          Background ? Background : "bg-white shadow"
        } ${ClassName}   ${width ? width : " md:max-w-[50rem]"}`} //apply "md" when change Width
        style={cardStyle}
      >
        {/* <div className="flex justify-end -mt-3  -mr-3">
          <button
            className=" left-[95%] text-sm top-0 px-2 z-10 border hover:bg-zinc-950 hover:text-white rounded-full"
            onClick={removePopUp}
          >
            X
          </button>
        </div> */}

        {children}
      </motion.div>
    </motion.div>
  );
};

const popup = ({
  children,
  removePopUp,
  Background,
  className,
  width,
  height,
  closeButton,
  closeButtonClassName,
  maxHeight,
  cwidth,
  cardContainerClassName,
  overflow,
}) => {
  return (
    <div
      className={`fixed inset-0 h-screen flex items-center justify-center z-20 ${cardContainerClassName} `}
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/50" // Increased opacity for better overlay
        onClick={removePopUp}
      ></div>
      {/* {closeButton !== "false" && (
        <div
          className={`absolute right-5 hidden sm:block top-5 -mt-3  -mr-3  z-50`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 border rounded-full cursor-pointer bg-white hover:bg-gray-100 ${closeButtonClassName}`}
            onClick={removePopUp}
          >
            <RxCross2 className="text-lg" />
          </div>
        </div>
      )} */}

      {/* Popup container */}

      <div
        className={`relative z-60  rounded-xl p-4   ${
          Background ? Background : "bg-white shadow"
        } ${className}   ${
          cwidth || width ? cwidth : "w-11/12 md:max-w-[50rem]"
        }`} //apply "md" when change Width
        style={{
          height: height ? height : "80%",
          width: width ? width : "",
          maxHeight: maxHeight ? maxHeight : "",
        }}
      >
        {closeButton !== "false" && (
          <div
            className={`absolute bottom-full right-0  mb-1  md:left-full  md:top-0  `}
          >
            <div
              className={`flex items-center justify-center md:w-8 w-5 md:h-8 h-5 rounded-lg md:rounded-xl ml-1 cursor-pointer bg-white hover:bg-gray-100 ${closeButtonClassName}`}
              onClick={removePopUp}
            >
              <RxCross2 className="text-sm md:text-lg" />
            </div>
          </div>
        )}
        <div
          className=" w-full h-full"
          style={{ overflow: overflow ? overflow : "auto" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, onClick, color }) => (
  <div
    className="text-center w-full border rounded-xl cursor-pointer flex justify-between items-center px-3 py-3"
    onClick={onClick}
  >
    <p className="text-sm md:text-base font-semibold flex items-center gap-2  capitalize">
      <GoDot />
      {label}
    </p>
    <p
      className={` font-semibold text-gray-800 px-5 rounded-full text-xs md:text-sm`}
      style={{ backgroundColor: color }}
    >
      {value}
    </p>
  </div>
);

const Card = { AddPopUp, popup, StatCard };

export default Card;
