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

const Userlist = () => {
    const [userData, setUserData] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editToggle, setEditToggle] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newFilter, setNewFilter] = useState({
        name: '',
        status: 'Active'
    });
    const [loading, setloading] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setloading(true);
        try {
            const response = await axios.get(`${apiurl}/admin/analytics/user-activity`, {
                headers: {
                    "ngrok-skip-browser-warning": "69420"
                }
            });
            const data = await response.data;
            if (data.success) {
                console.log("data", data);
                setUserData(data?.data);
                setAllUsers(data?.data)
            }
        } catch (error) {
            console.error('Error fetching filters:', error);
        }
        finally {
            setloading(false);
        }
    };



    const handleSearch = (value) => {
        const trimmedValue = value.trim();
        setSearchInput(trimmedValue);

        if (!trimmedValue) {
            setUserData(allUsers);
            return;
        }

        console.log("trimmed value", trimmedValue);

        const updatedFilter = userData.filter(item =>
            item?.ipAddress.includes(trimmedValue.toLowerCase())
        );

        setUserData(updatedFilter);
    };

    return (
        <Layout>
            <Container>
                {loading == true ? (
                    <DynamicLoader maintext="wait" subtext="Fetching User's Data" />
                ) : null}
                <div className="flex flex-wrap justify-between w-full h-full  overflow-auto">
                    <div className="flex flex-col  py-2 px-2 w-full">
                        <BackHeader
                            title="Users"
                            rightSide={
                                <div className="flex gap-3 w-[500px]">

                                  

                                    <Input.search
                                        placeholder="Search User"
                                        value={searchInput}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                            }
                        />
                        <div className="p-6">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            {[
                                                "SN.",
                                                "IP",
                                                "User Id",
                                                "Device",
                                                "Visit Date"
                                               
                                            ].map((item, index) => (
                                                <th key={index} scope="col" className="px-6 py-3">
                                                    {item}
                                                </th>
                                            ))}
                                        </tr>

                                    </thead>
                                    <tbody className="text-sm text-gray-700">
                                        {userData?.map((user, index) => (
                                            <tr key={user?.id} className="border-t">
                                                <td className="px-4 py-3">{index + 1}</td>
                                                <td className="px-4 py-3">
                                                   {user.ipAddress}
                                                </td>
                                                <td className="px-4 py-3">
                                                   {user.userId}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {user?.userAgent}
                                                </td>
                                                 <td className="px-4 py-3">
                                                    {new Date(user?.createdAt).toLocaleDateString()}
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

export default Userlist;
