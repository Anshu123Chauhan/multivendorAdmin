import React, { useContext } from "react";
import { useUser } from "./userProvider";

const UserPermissions = () => {
  const { permissions } = useUser();
  return null;
};

export default UserPermissions;
