import React, { useEffect, useState } from 'react';
import Layout, { Container } from '../components/layout';
import { useUser } from '../config/userProvider';
import { BlackButton } from '../components/buttonContainer';
import BackHeader from '../components/backHeader';
import FormatDateTime,{formatdate} from '../components/formatDateTime';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiurl } from '../config/config';
import { DynamicLoader } from '../components/loader';


function AdminProfile() {
    const admin_details = useUser();
    const { userData, token } = admin_details;
    const navigate = useNavigate();

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
    }, [])

    const editAdminDetails = (e) => {
        e.preventDefault()
        navigate(`/profile/${userData?._id}/edit`)
    }
    return (
        <Layout>
            <Container>
                {
                    loading === true ? <DynamicLoader maintext="wait" subtext="Fetching Admin Details" /> : null
                }
                <div className="flex flex-wrap justify-between w-full h-full">
                    <div className="flex flex-col p-2 w-[100%] h-[100%] overflow-scroll">


                        <BackHeader
                            backButton={true}
                            link="/dashboard"
                            // title="Customer Details"
                            rightSide={
                                <BlackButton
                                    handleSubmit={editAdminDetails}
                                    title="Edit"
                                />
                            }
                        />
                        <div className=" mt-5 md:mt-4 md:p-5">
                            <p className="text-slate-500 font-semibold my-5">Admin Deatils:</p>
                            <div className='md:px-10 h-full overflow-auto'>
                                <div className="flex flex-col md:flex-row md:gap-4">
                                    <div className="w-full text-slate-500">
                                        <p className="text-sm">Name :</p>
                                        <div className="w-full border bg-white border-slate-200 focus:outline-none px-4 py-2 my-2 rounded-lg">
                                            {admindata?.username || "N/A"}
                                        </div>
                                    </div>

                                    <div className="w-full text-slate-500">
                                        <p className="text-sm">Email :</p>

                                        <div className="w-full border bg-white border-slate-200 focus:outline-none px-4 py-2 my-2 rounded-lg">
                                            {admindata?.email || "N/A"}
                                        </div>
                                    </div>
                                </div>


                                <div className="flex flex-col md:flex-row md:gap-4">
                                    <div className="w-full text-slate-500">
                                        <p className="text-sm">Roll :</p>
                                        <div className="w-full border bg-white border-slate-200 focus:outline-none px-4 py-2 my-2 rounded-lg">
                                            {admindata?.role || "N/A"}
                                        </div>
                                    </div>

                                    <div className="w-full text-slate-500">
                                        <p className="text-sm">Status :</p>

                                        <div className="w-full border bg-white border-slate-200 focus:outline-none px-4 py-2 my-2 rounded-lg">
                                            {admindata?.isActive === true ? "Active" : "Inactive" || "N/A"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:gap-4">
                                    <div className="w-full text-slate-500">
                                        <p className="text-sm">GST Number :</p>
                                        <div className="w-full border bg-white border-slate-200 focus:outline-none px-4 py-2 my-2 rounded-lg">
                                            {admindata?.gstNumber || "N/A"}
                                        </div>
                                    </div>

                                    <div className="w-full text-slate-500">
                                        <p className="text-sm">Created by :</p>

                                        <div className="w-full border bg-white border-slate-200 focus:outline-none px-4 py-2 my-2 rounded-lg">
                                            {admindata?.createdBy || "N/A"}
                                        </div>
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
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Layout>
    )
}

export default AdminProfile