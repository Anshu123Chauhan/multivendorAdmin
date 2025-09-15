import React, { useEffect, useState } from "react";
import Settinglayout from '../components/Settinglayout';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { AiTwotoneEdit, AiOutlineDelete } from "react-icons/ai";
import { apiurl } from "../config/config";
import { ToastContainer, toast } from "react-toastify";
import { DynamicLoader } from "../components/loader";
import BackHeader from "../components/backHeader";




const Permission = () => {
    const navigate = useNavigate();
    const scToken = Cookies.get('zrotoken')
    // console.log(scToken)

    const [showPopup, setShowPopup] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userlist, Setuserlist] = useState({});
    const [loading, setloading] = useState(false)

    const { data, ListingPerPage = 10, TotalData, currentPage, totalPages } = userlist;

    const [current_Page, setCurrentPage] = useState(currentPage || 1);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleAllAdmin = async () => {
        setloading(true)
        try {
            const res = await axios.get(`${apiurl}/api/admin/allAdmin?page=${current_Page}&limit=${ListingPerPage}`, {
                headers: {
                    Authorization: scToken,
                },
            });
            if (res.status === 200) {
                Setuserlist(res.data)
                setloading(false)
            }
            console.log(res);
        } catch (error) {
            console.error('Error fetching admins:', error.response?.data || error.message);
            setloading(false)
        }
    };

    useEffect(() => {
        handleAllAdmin()
    }, [current_Page])

    console.log(userlist)
    const handlePermissionClick = () => {
        // setSelectedUser(user);
        setShowPopup(true);
    };

    const onClose = () => {
        setShowPopup(false)
    }

    const handledeleteAdmin = async (id) => {
        setloading(true)
        onClose()
        try {
            const res = await axios.post(`${apiurl}/api/admin/deleteStaff`, { _id: id }, {
                headers: {
                    Authorization: scToken,
                    'Content-Type': 'application/json',
                },
            });
            console.log(res)
            if (res.status === 200) {
                toast.success("Details updated successfully!");
                setloading(false)
                handleAllAdmin()
            }
        } catch (error) {
            console.error("Error updating admin details:", error.response?.data || error.message);
            toast.error("Failed to update details!");
            setloading(false)
        }
    };

    const handleDeleteConfirm = (id) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete ?`
        );
        if (confirmDelete) {
            handledeleteAdmin(id)
        }
    };

    return (
      <Settinglayout>
        {/* {loading === true ? <DynamicLoader maintext="wait" subtext="Fetching Staff Details" /> : null} */}
        {/* <div className="p-6 bg-gray-50 min-h-screen"> */}
        {/* Permissions Section */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold ">Users and Permissions</h2>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-500">
            <Link to="/settings/permission/addstaff">Add +</Link>
          </button>
        </div>

        <div className="mb-6 bg-white border border-orange-600/50 rounded-lg shadow p-2">
          <p className="text-sm text-gray-600">
            Manage what users can see or do in your store.
          </p>
        </div>

        {/* Staff */}
        <div className=" w-full h-full mt-6 p-6   bg-white shadow rounded-lg overflow-auto">
          <table className="min-w-full table-auto border-collapse  overflow-auto">
            <thead className="bg-gray-100 text-sm text-gray-600 uppercase font-medium">
              <tr>
                <th className="py-3 px-4 text-left">Sr.No</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {data?.map((user, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 ? "odd:bg-white" : "even:bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{user.username}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.role}</td>
                  <td className=" flex py-3 px-4 ">
                    <div className="flex gap-2 text-2xl">
                      <AiTwotoneEdit
                        className="p-1 rounded-md text-blue-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200"
                        onClick={() => {
                          navigate("/settings/permission/edit", {
                            state: { userId: user?._id },
                          });
                        }}
                      />
                      <AiOutlineDelete
                        className="p-1 rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200"
                        onClick={() => {
                          handlePermissionClick();
                        }}
                        // onClick={() => { handleDeleteConfirm(user?._id) }}
                      />
                      <ToastContainer />
                    </div>

                    {showPopup ? (
                      <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-transparent ">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
                          <h2 className="text-xl font-semibold text-gray-800">
                            Delete Confirmation
                          </h2>
                          <p className="text-sm text-gray-600 mt-2">
                            Are you sure you want to delete ? This action cannot
                            be undone.
                          </p>

                          <div className="flex justify-end mt-6 space-x-3">
                            <button
                              onClick={onClose}
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                handledeleteAdmin(user?._id);
                              }}
                              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center mt-4 space-x-4">
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
        </div>
        {/* </div> */}
      </Settinglayout>
    );
};

export default Permission;
