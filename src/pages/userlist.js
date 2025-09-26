import React, { useState, useEffect } from "react";
import Layout, { Container } from "../components/layout";
import BackHeader from "../components/backHeader";
import Input from "../components/inputContainer";
import Card from "../components/card";
import { useUser } from "../config/userProvider";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { apiurl } from "../config/config";
import { DynamicLoader } from "../components/loader";
import { AiOutlineEye } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useStepContext } from "@mui/material";
import { getCookie } from "../config/webStorage";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const UserList = () => {
  const [userData, setuserData] = useState([]);

  const [allAdmin, setAllAdmin] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editToggle, setEditToggle] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newFilter, setNewFilter] = useState({
    name: "",
    status: "Active",
  });
  const [loading, setloading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const token = getCookie("zrotoken");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setloading(true);
    try {
      const response = await axios.get(`${apiurl}/admin/user-List`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (response.data.success === true) {
        setuserData(response?.data?.user);
        setAllAdmin(response?.data?.user);
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
    } finally {
      setloading(false);
    }
  };

  const toggleStatus = async (admin) => {
    const { id } = admin;

    try {
      const response = await axios.put(
        `${apiurl}/admin/auth/update`,
        {
          id: id,
          username: admin?.username,
          email: admin?.email,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.data;
      if (data.success) {
        fetchUser();
      }
    } catch (error) {
      console.error("Error updating admin status:", error);
    }
  };

  const handleEditStatus = (id) => {
    navigate(`/editUser/${id}`);
  };

  const deleteuser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Deleting admin with id:", id);
        handleDeleteuser(id);
        Swal.fire("Deleted!", "The admin has been deleted.", "success");
      }
    });
  };

  const handleDeleteuser = async (id) => {
    try {
      const response = await axios.delete(`${apiurl}/admin/user-delete/${id}`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      const data = await response.data;

      if (data.success) {
        toast.success("Deleted Successfully");
        fetchUser();
      }
    } catch (error) {
      console.error("Error updating filter:", error);
    }
  };

  const handleSearch = (value) => {
    const trimmedValue = value.trim();
    setSearchInput(trimmedValue);

    if (!trimmedValue) {
      setuserData(allAdmin);
      return;
    }

    console.log("trimmed value", trimmedValue);

    const updatedFilter = userData.filter((item) =>
      item?.username.toLowerCase().includes(trimmedValue.toLowerCase())
    );

    setuserData(updatedFilter);
  };

  return (
    <Layout>
      <Container>
        {loading == true ? (
          <DynamicLoader maintext="wait" subtext="Fetching user Data" />
        ) : null}
        <div className="flex flex-wrap justify-between w-full">
          <div className="flex flex-col  py-2 px-2 w-full">
            <BackHeader
              title="users"
              rightSide={
                <div className="flex gap-3 w-[80%]">
                  <button
                    className="bg-[#000] hover:bg-[#e7c984] hover:text-[#000]  text-[#fff] w-[150px] p-2 rounded-md"
                    onClick={() => navigate("/addrole")}
                  >
                    Create Role
                  </button>
                  <button
                    className="bg-[#000] hover:bg-[#e7c984] hover:text-[#000]  text-[#fff] w-[150px] p-2 rounded-md"
                    onClick={() => navigate("/adduser")}
                  >
                    Add User
                  </button>
                   
                    <button className="bg-[#000] hover:bg-[#e7c984] hover:text-[#000]  text-[#fff] w-[150px] p-2 rounded-md"  onClick={() => navigate("/role")}>
                      Roles list
                    </button>
                  

                  <Input.search
                    placeholder="Search user"
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              }
            />
            <div className="relative shadow-md sm:rounded-lg mt-5 overflow-auto h-[75vh]">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-20">
                  <tr>
                    {[
                      "SN.",
                      "Name",
                      "Phone no.",
                      "Email",
                      "Role Name",
                      "Status",
                      "Action",
                    ].map((item, index) => (
                      <th key={index} scope="col" className="px-6 py-3">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {userData?.map((user, index) => (
                    <tr
                      key={user?.id}
                      className="border-t relative overflow-hidden group hover:bg-gray-50 transition-all duration-500"
                    >
                      <td className="relative px-6 py-3">{index + 1}</td>
                      <td className="relative px-6 py-3 capitalize">
                        {user?.username}
                      </td>
                      <td className="relative px-6 py-3">{user?.phone}</td>
                      <td className="relative px-6 py-3">{user?.email}</td>
                      <td className="relative px-6 py-3">{user?.role_id?.role_name}</td>
                      <td className="relative px-6 py-3">
                        {user?.isActive === true ? "Approved" : "Pending"}
                      </td>
                      <td className="relative px-4">
                        <span className="flex gap-1 cursor-pointer">
                          <CiEdit
                            className="p-1 text-2xl rounded-md text-green-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200 ml-1"
                            onClick={() => handleEditStatus(user?._id)}
                          />
                          <MdDeleteForever
                            className="p-1 text-2xl rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200 ml-1"
                            onClick={() => deleteuser(user?._id)}
                          />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default UserList;
