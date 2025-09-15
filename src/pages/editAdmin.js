import React, { useEffect, useState } from "react";
import Layout, { Container } from "../components/layout"
import { DynamicLoader } from "../components/loader";
import BackHeader from "../components/backHeader";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { apiurl } from "../config/config"
import { useParams, useNavigate } from "react-router-dom";
import { getCookie } from "../config/webStorage";
const EditAdmin = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [adminData, setadminData] = useState({  
        username:"",
        email:""
    });

    const [errors, setErrors] = useState({
        username: "",
        email: "",
       
    });
    const token = getCookie("zrotoken");

     const handleInputChange = (e) => {
        const { name, value } = e.target;
        setadminData({
            ...adminData,
            [name]: value,
        });
    };
    const handleUpload = async () => {
     
        try {
            const response = await axios.put(`${apiurl}/admin/auth/update`, {
                id: id,
                username: adminData?.username,
                email: adminData?.email,
                
            },
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                }
            },);

            const data = await response.data;
            if (data.success) {
                toast.success("Updated Successfully")
                handleGetAdmin();
            }
        } catch (error) {
            console.error('Error updating admin status:', error);
        }
    };
    const handleGetAdmin = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`${apiurl}/admin/auth/list/${id}`,
                {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                }
            }
            );
            const data = await response?.data;
            console.log(data.success)
            if (data.success) {
                const { username, email } = data?.data;

                setadminData({
                    username: username,
                    email: email,
                   
                })
            }
        }
        catch (error) {
            console.log('Error Updating Data', error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetAdmin();
    }, []);

    return (
        <Layout>
            <Container>
                {loading == true ? (
                    <DynamicLoader maintext="wait" subtext="Fetching Admin Data" />
                ) : null}
                <div className="flex flex-wrap justify-between w-full h-full  overflow-auto">
                    <ToastContainer />
                    <div className="flex flex-col  py-2 px-2 w-full">
                        <BackHeader
                            title="Edit Admin"
                            backButton={true}
                            link="/adminlist"
                        />
                        <div className="p-6">
                            <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
                                <div className="flex flex-col gap-6">
                                    {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
                                   <div>
                                        <div className="w-full">
                                        <label className="text-sm text-slate-500">User Name :</label>
                                        <input
                                            name="username"
                                            value={adminData.username}
                                            placeholder="Enter User Name."
                                            className="w-full border border-slate-200 focus:outline-none px-4 py-2 my-2 rounded-lg"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                        {errors.username && (
                                            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="w-full">
                                        <label className="text-sm text-slate-500">Email :</label>
                                        <input
                                            name="email"
                                            value={adminData.email}
                                            placeholder="Enter Email."
                                            className="w-full border border-slate-200 focus:outline-none px-4 py-2 my-2 rounded-lg"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                  
                                    {/* </div> */}
                                    <div>
                                        <button className="px-4 py-2 rounded-md font-semibold bg-orange-600 text-white float-right"
                                            onClick={handleUpload}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Layout>
    );
}

export default EditAdmin;