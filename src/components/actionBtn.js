import React from "react";
import { AiOutlineEye } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ActionButton = ({ item, permission, onView, onEdit, onDelete, tabName, userType }) => {
  const navigate = useNavigate();

  let perm = null;

  if (userType === "User") {
    perm = Array.isArray(permission)
      ? permission.find((p) => p.tab_name?.toLowerCase() === tabName.toLowerCase())
      : null;
  } else {
    perm = { p_read: true, p_update: true, p_delete: true };
  }

  return (
    <div className="flex text-2xl">
      {perm?.p_read && (
        <AiOutlineEye
          className="p-1 rounded-md text-blue-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200"
          onClick={onView}
        />
      )}

      {perm?.p_update && (
        <CiEdit
          className="p-1 rounded-md text-green-400 cursor-pointer hover:bg-green-400 hover:text-white bg-green-50 border border-green-200 ml-1"
          onClick={onEdit}
        />
      )}

      {perm?.p_delete && (
        <MdDeleteForever
          className="p-1 rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200 ml-1"
          onClick={onDelete}
        />
      )}
    </div>
  );
};

export default ActionButton;
