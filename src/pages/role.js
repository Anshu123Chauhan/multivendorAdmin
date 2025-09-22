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
import { ToastContainer, toast } from "react-toastify";
import { getCookie } from "../config/webStorage";
const Role = () => {
  const { userData } = useUser();
  const token = getCookie("zrotoken");
  const [loading, setloading] = useState(false);
  const [editDetails, setEditDetails] = useState("");
  const [roles, setRoles] = useState("");
  const [pagination, setPagination] = useState({});
  const [serachData, setserchData] = useState([]); // Filtered list
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const {
    currentPage = 1,
    itemsPerPage = 10,
    totalItems,
    totalPages,
  } = pagination;
  const [current_Page, setCurrentPage] = useState(currentPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  //fetch store list

  const fetchRoleList = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/admin/role-permission`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response?.data);
      if (response?.data.success === true) {
        setRoles(response?.data?.data || []);
        setserchData(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchRoleList();
  }, []);
  const [searchInput, setSearchInput] = useState("");
  const handleSearch = (value) => {
    setSearchInput(value.trim());

    if (!value.trim()) {
      setCurrentPage(1);
      setserchData(roles);
      return;
    }

    // Filter store data based on store name (handle case sensitivity)
    const filteredData = roles.filter(
      (store) =>
        store?.role_name?.toLowerCase().includes(value.toLowerCase())
    );
    console.log(filteredData);

    setCurrentPage(1); // Reset pagination to first page
    setserchData(filteredData);
  };

  const deleteRole = async (roleId) => {
    if (!window.confirm("Are you sure you want to delete this role?"))
      return;

    try {
      setloading(true);
       await axios.delete(
        `${apiurl}/admin/role-permission/${roleId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
        toast.success("Role deleted successfully")
        fetchRoleList();
      // Filter out the deleted category from the UI
      // setCategories(categories.filter((category) => category._id !== categoryId));
      // setserchData(serachData.filter((category) => category._id !== categoryId));
    } catch (error) {
      console.error("Error deleting role:", error);
    } finally {
      setloading(false);
    }
  };

  const navigate = useNavigate();
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log(formData)

    try {
      setUploading(true);
      const response = await axios.post(
        `${apiurl}/admin/role/importCatgories`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      console.log("Upload Successful:", response.data);
      toast.success(" Role imported successfully");
      fetchRoleList();
      setIsOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload Failed:", error);
      toast.error(" File not imported");

      // alert("File upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  return (
    <Layout>
      <Container>
        {loading == true ? (
          <DynamicLoader maintext="wait" subtext="Fetching Role Data" />
        ) : null}
        <div className="flex flex-wrap justify-between w-full h-full  overflow-auto">
          <div className="flex flex-col  py-2 px-2 w-full">
            <BackHeader
              title="Roles"
              rightSide={
                <div className="flex gap-3 w-[650px]">
                  {/* <button
                    onClick={() => setIsOpen(true)}
                    className="bg-[#000] hover:bg-[#e7c984] hover:text-[#000] text-white min-w-[160px] py-2 px-4 rounded-md shadow-md transition whitespace-nowrap"
                  >
                    Import Category
                  </button> */}
                 
                  <Link to="/addRole">
                    <button className="bg-[#000] hover:bg-[#e7c984] hover:text-[#000] text-[#fff] w-[150px] p-2 rounded-md">
                      Add Role
                    </button>
                  </Link>

                  <Input.search
                    placeholder="Search Role "
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              }
            />

            

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    {[
                      "SN.",
                      "Role Name",
                      "action",
                    ].map((item, index) => (
                      <th key={index} scope="col" className="px-6 py-3">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {serachData &&
                    serachData?.map((role, index) => {
                      return (
                        <tr
                          key={role.id}
                          className="bg-white border-b cursor-pointer"
                        >
                          <td className="px-4 py-4">{index + 1}</td>

                          <td className="px-6 py-4">
                            {role?.role_name}
                          </td>
                       

                       
                          
                        
                          <td className="px-6 py-4">
                            <div className="flex text-2xl">
                              {/* <AiOutlineEye
                                className="p-1 rounded-md text-blue-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200"
                                onClick={() =>
                                  navigate(`/roles/${role?._id}`)
                                }
                              /> */}
                              <CiEdit
                                onClick={() =>
                                  navigate(`/editRole/${role?._id}`)
                                }
                                className="p-1 rounded-md text-green-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200 ml-1"
                              />
                              <MdDeleteForever
                                className="p-1 rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200 ml-1"
                                onClick={() => deleteRole(role?._id)}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            {/* <div className="flex justify-center items-center mt-5 space-x-4">
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(current_Page - 1)}
                disabled={current_Page === 1}
              >
                Previous
              </button>

              <span className="text-gray-700 font-medium">
                Page {current_Page} of {totalPages}
              </span>

              <button
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(current_Page + 1)}
                disabled={current_Page === totalPages}
              >
                Next
              </button>
            </div> */}
          </div>
        </div>
              {/* Modal */}
              {isOpen && !uploading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                  <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-96 backdrop-blur-md">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center border-b pb-2">
                      <h2 className="text-xl font-semibold">Import Files</h2>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                      >
                        ✕
                      </button>
                    </div>
        
                    {/* Modal Body */}
                    <div className="mt-4">
                      <input type="file" onChange={handleFileChange} className="border p-2 w-full" />
                    </div>
        
                    {/* Modal Footer */}
                    <div className="flex flex-col items-center mt-4 space-y-3">
                      <div className="flex justify-end space-x-2 w-full">
                        <button
                          onClick={() => setIsOpen(false)}
                          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpload}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          disabled={uploading}
                        >
                          Upload
                        </button>
                      </div>
        
                    </div>
                  </div>
                </div>
              )}
        
              {/* Show DynamicLoader Below the Button when Uploading */}
              {uploading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
                  <DynamicLoader maintext="Wait" subtext="Fetching Service Data..." />
                </div>
              )}
      </Container>
    </Layout>
  );
};

export default Role;
