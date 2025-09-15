import { BiError } from "react-icons/bi";

const Error = ({ err, icon, iconSize, absolute, className }) => (
  <div className={`flex justify-between  ${className}`}>
    <div className="bg-red-50 border border-red-300 text-red-600 px-5 rounded-md flex items-center gap-1">
      <span className={`${iconSize ? iconSize : "text-xl"}`}>
        {icon ? icon : <BiError />}
      </span>
      {err}
    </div>
  </div>
);

export default Error;
