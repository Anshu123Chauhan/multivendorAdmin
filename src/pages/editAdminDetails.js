import React, { useEffect, useState } from 'react';
import Layout, { Container } from '../components/layout';
import BackHeader from '../components/backHeader';
import { useUser } from '../config/userProvider';
import FormatDateTime,{formatdate} from '../components/formatDateTime';
import axios from 'axios';
import { apiurl } from '../config/config';
import { DynamicLoader } from '../components/loader';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';


function EditAdminDetails() {
    const navigate = useNavigate();
    const admin_details = useUser();
    const { userData, token } = admin_details;


    const [loading, setLoading] = useState(false)
    const [admindata, setAdminData] = useState({
        username: "",
        email: "",
        role: "",
        isActive: "",
        gstNumber: "",
        createdBy: "",
        createdAt: "",
        updatedAt: ""
    });

    const handleGetProfileData = async (e) => {
        setLoading(true)
        try {
            const res = await axios.post(
                `${apiurl}/api/admin/getProfileDetails`, { adminId: userData._id },

                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            if (res.status === 200) {
                setAdminData(res?.data?.data);
                setLoading(false)
            }
        } catch (error) {
            console.error('Error upadte admin:', error.response?.data || error.message);
            setLoading(false)
        }
    };

    useEffect(() => {
        handleGetProfileData()
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminData({
            ...admindata,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        const data = {
            adminId: userData._id,
            gstNumber: admindata.gstNumber,
            username: admindata.username,
            email: admindata.email
        }

        try {
            const res = await axios.post(
                `${apiurl}/api/admin/updateProfileDetails`,
                data,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            console.log(res)
            if (res.status === 200) {
                setLoading(false)
                toast(`admin Updated Succesfully`)
                navigate('/profile')
            }
        } catch (error) {
            console.error('Error upadte admin:', error.response?.data || error.message);
        }
    };

    return (
        <Layout>
            <Container>
                {loading === true ? <DynamicLoader maintext="wait" subtext="Fetching Customer Details" /> : null}
                <div className="flex flex-wrap justify-between w-full h-full">
                    <div className="flex flex-col  py-2 px-2 md:px-14  w-[100%] h-[100%] overflow-scroll">
                        {/* <h2 className="text-2xl font-bold mb-4 text-slate-500 text-center p-4">
                            Edit Details
                        </h2> */}
                        {/* <div className="flex items-center justify-between w-full">
                <div
                  className="flex items-center justify-center border border-slate-300 rounded-md w-8 h-8 cursor-pointer"
                  onClick={handleBack}
                >
                  <IoMdArrowRoundBack className="text-slate-500" />
                </div>
                <h2 className="text-xl md:text-2xl text-center flex-1 text-slate-500 font-bold">
                  Edit Details
                </h2>
              </div> */}

                        <BackHeader
                            //   title=" Edit Details"
                            backButton={true}
                            link={`/profile`}
                        // rightSide={<BlackButton title="Edit" />}
                        />
                        <div className="mt-5">
                            <p className="text-slate-500 font-semibold">Edit Details:</p>
                            <div className="px-10 py-3">
                                <div className="flex gap-4">
                                    <div className="w-full">
                                        <label className="text-sm text-slate-500">Name :</label>
                                        <input
                                            name="username"
                                            value={admindata.username || "N/A"}
                                            placeholder="Enter Name"
                                            className="w-full border border-slate-200 focus:outline-none px-4 py-2 my-2 rounded-lg"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="text-sm text-slate-500">Email :</label>
                                        <input
                                            name="email"
                                            value={admindata.email || "N/A"}
                                            placeholder="Enter Email."
                                            className="w-full border border-slate-200 focus:outline-none px-4 py-2 my-2 rounded-lg"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>


                                <div className="flex gap-4">

                                    <div className="w-full">
                                        <label className="text-sm text-slate-500">GST Number :</label>
                                        <input
                                            name="gstNumber"
                                            value={admindata.gstNumber || "N/A"}
                                            placeholder="Enter GST Number"
                                            className="w-full border border-slate-200 focus:outline-none px-4 py-2 my-2 rounded-lg"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="text-sm text-slate-500">Status :</label>
                                        <input
                                            name="isActive"
                                            value={admindata.isActive === true ? "Active" : "Inactive" || "N/A"}
                                            placeholder="Enter Status"
                                            className="w-full border border-slate-200 text-slate-500 focus:outline-none px-4 py-2 my-2 rounded-lg"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-full">
                                        <label className="text-sm text-slate-500">Role :</label>
                                        <input
                                            name="role"
                                            value={admindata.role || "N/A"}
                                            placeholder="Enter Role"
                                            className="w-full border border-slate-200 text-slate-500 focus:outline-none px-4 py-2 my-2 rounded-lg"
                                            readOnly
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="text-sm text-slate-500">Created by :</label>
                                        <input
                                            name="createdBy"
                                            value={admindata.createdBy || "N/A"}
                                            placeholder="Created by"
                                            className="w-full border text-slate-500 border-slate-200 focus:outline-none px-4 py-2 my-2 rounded-lg"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:gap-4">
                                    <div className="w-full text-slate-500">
                                        <p className="text-sm">Created At :</p>
                                        <div className="w-full border bg-white border-slate-200 focus:outline-none px-4 py-2 my-2 rounded-lg">
                                            {formatdate(admindata?.createdAt) || "N/A"}
                                        </div>
                                    </div>

                                    <div className="w-full text-slate-500">
                                        <p className="text-sm">Upadted At :</p>

                                        <div className="w-full border bg-white border-slate-200 focus:outline-none px-4 py-2 my-2 rounded-lg">
                                            {formatdate(admindata?.updatedAt) || "N/A"}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button className="bg-black text-white px-4 py-2 rounded-md mt-4"
                                        onClick={() => { handleSubmit() }}
                                    >
                                        Save
                                    </button>
                                    {/* <BlackButton title="Save" /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Layout>
    )
}

export default EditAdminDetails