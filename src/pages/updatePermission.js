import React, { useEffect, useState } from "react";
import Settinglayout from "../components/Settinglayout";
import { IoIosArrowRoundBack } from "react-icons/io";
import Cookies from 'js-cookie';
import axios from "axios";
import { apiurl } from "../config/config";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DynamicLoader } from "../components/loader";
import BackHeader from "../components/backHeader";

const UpdatePermission = () => {
    const navigate = useNavigate();
    const scToken = Cookies.get('zrotoken');
    const location = useLocation();
    const userId = location.state?.userId;
    const [loading, setloading] = useState(false)

    const [formData, setFormData] = useState({
        username: "",
        passward: "",
        email: "",
        role: "",
        permissions: {
            Product: {
                read: false,
                write: false,
                update: false,
                delete: false,
            },
            user: {
                read: false,
                write: false,
                update: false,
                delete: false,
            },
            order: {
                read: false,
                write: false,
                update: false,
                delete: false,
            },
            support: {
                read: false,
                write: false,
                update: false,
                delete: false,
            },
            order_manage: {
                read: false,
                write: false,
                update: false,
                delete: false,
            },
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e, group) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [group]: {
                    ...prev.permissions[group],
                    [name]: checked,
                },
            },
        }));
    };


    const handleEachAdminDetails = async () => {
        setloading(true)
        const data = { _id: userId };
        try {
            const res = await axios.post(`${apiurl}/api/admin/getUpdatedAdminDetails`, data, {
                headers: {
                    Authorization: scToken,
                    'Content-Type': 'application/json',
                },
            });
            console.log(res)
            if (res?.status === 200) {
                setloading(false)
                const fetchedData = res.data.data;
                setFormData({
                    username: fetchedData.username || "",
                    email: fetchedData.email || "",
                    role: fetchedData.role || "",
                    permissions: { ...fetchedData.permissions },
                });
            }
        } catch (error) {
            console.error("Error fetching admin details:", error.response?.data || error.message);
            setloading(false)
        }
    };

    const handleSubmit = async () => {
        setloading(true)
        const data = {
            _id: userId,
            ...formData
        }
        try {
            const res = await axios.post(`${apiurl}/api/admin/getStaffDetails`, data, {
                headers: {
                    Authorization: scToken,
                    'Content-Type': 'application/json',
                },
            });
            console.log(res)
            if (res.status === 200) {
                setloading(false)
                toast.success("Details updated successfully!");
                navigate('/settings/permission')

            }
        } catch (error) {
            console.error("Error updating admin details:", error.response?.data || error.message);
            toast.error("Failed to update details!");
            setloading(false)
        }
    };

    useEffect(() => {
        handleEachAdminDetails();
    }, []);

    return (
        <Settinglayout>
            {loading === true ? <DynamicLoader maintext="wait" subtext="Getting Staff Info" /> : null}
            <div className="w-full h-full bg-gray-100 p-4">
                <div className="h-[10%]">
                <BackHeader
                    title="Update Staff and Permissions"
                    backButton={true}
                    link="/settings/permission"
                    rightSide={
                        <div>
                        <button
                            className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
                            onClick={handleSubmit}
                        >
                            Update
                        </button>
                        <ToastContainer />
                    </div>
                    }
                />
                </div>

                <div className="mx-auto p-4 bg-gray-100 rounded-md shadow-md overflow-scroll h-[90%]">
                    <div className="flex justify-between">
                        <div className="mb-4 w-1/2 px-2">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="username">
                                Name
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4 w-1/2 px-2">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mb-4 w-1/2 px-2">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="role">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" selected >Select a role</option>
                            <option value="SubAdmin">Sub Admin</option>
                            <option value="SuperAdmin">Super Admin</option>
                            {/* <option value="Other">Other</option> */}
                        </select>
                    </div>

                    <p className="font-bold border-b-2 mb-3">Permissions</p>
                    {Object.keys(formData.permissions).map((group) => (
                        <div className="mb-4 flex justify-between" key={group}>
                            <label className="block text-gray-700 font-medium mb-2">
                                {group.charAt(0).toUpperCase() + group.slice(1)}
                            </label>
                            <div className="flex flex-wrap gap-4">
                                {["read", "write", "update", "delete"].map((perm) => (
                                    <label key={perm} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name={perm}
                                            checked={formData.permissions[group][perm]}
                                            onChange={(e) => handleCheckboxChange(e, group)}
                                            className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                                        />
                                        <span className="text-gray-700 capitalize">{perm}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}


                </div>
            </div>
        </Settinglayout>
    );
};

export default UpdatePermission;
