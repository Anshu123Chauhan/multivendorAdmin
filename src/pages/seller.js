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

const Seller = () => {
  const [adminData, setAdminData] = useState([]);
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
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    setloading(true);
    try {
      const response = await axios.get(`${apiurl}/admin/auth/list`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      const data = await response.data;
      if (data.success) {
        console.log("data", data);
        setAdminData(data?.data);
        setAllAdmin(data?.data);
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
        fetchAdmin();
      }
    } catch (error) {
      console.error("Error updating admin status:", error);
    }
  };

  const handleEditStatus = (id) => {
    navigate(`/editadmin/${id}`);
  };

  const handleDeleteAdmin = async (id) => {
    try {
      const response = await axios.delete(`${apiurl}/admin/auth/delete/${id}`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      const data = await response.data;

      if (data.success) {
        toast.success("Deleted Successfully");
        fetchAdmin();
      }
    } catch (error) {
      console.error("Error updating filter:", error);
    }
  };

  const handleSearch = (value) => {
    const trimmedValue = value.trim();
    setSearchInput(trimmedValue);

    if (!trimmedValue) {
      setAdminData(allAdmin);
      return;
    }

    console.log("trimmed value", trimmedValue);

    const updatedFilter = adminData.filter((item) =>
      item?.username.toLowerCase().includes(trimmedValue.toLowerCase())
    );

    setAdminData(updatedFilter);
  };

  return (
    <Layout>
      <Container>
        {loading == true ? (
          <DynamicLoader maintext="wait" subtext="Fetching Admin Data" />
        ) : null}
        <div className="flex flex-wrap justify-between w-full h-full  overflow-auto">
          <div className="flex flex-col  py-2 px-2 w-full">
            <BackHeader
              title="Admin"
              rightSide={
                <div className="flex gap-3 w-[500px]">
                  <button
                    className="bg-[#000] hover:bg-[#e7c984] hover:text-[#000]  text-[#fff] w-[150px] p-2 rounded-md"
                    onClick={() => navigate("/addseller")}
                  >
                    Add Seller
                  </button>

                  <Input.search
                    placeholder="Search Your Admin"
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              }
            />
            <div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      {["SN.", "Name", "Email", "Action"].map((item, index) => (
                        <th key={index} scope="col" className="px-6 py-3">
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {adminData?.map((admin, index) => (
                      <tr key={admin?.id} className="border-t">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3 capitalize">
                          {admin?.username}
                        </td>
                        <td className="px-4 py-3">{admin?.email}</td>

                        <td>
                          <span className="flex gap-1 cursor-pointer">
                            <CiEdit
                              className="p-1 text-2xl rounded-md text-green-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200 ml-1"
                              onClick={() => handleEditStatus(admin?.id)}
                            />
                            <MdDeleteForever
                              className="p-1 text-2xl rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200 ml-1"
                              onClick={() => handleDeleteAdmin(admin?.id)}
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
        </div>
      </Container>
    </Layout>
  );
};

export default Seller;
