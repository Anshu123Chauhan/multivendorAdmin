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

const Banner = () => {
    const [bannerData, setBannerData] = useState([]);
    const [allBanners, setAllBanners] = useState([]);
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
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        setloading(true);
        try {
            const response = await axios.get(`${apiurl}/admin/banner/getAll`, {
                headers: {
                    "ngrok-skip-browser-warning": "69420"
                }
            });
            const data = await response.data;
            if (data.success) {
                console.log("data", data);
                setBannerData(data?.data);
                setAllBanners(data?.data)
            }
        } catch (error) {
            console.error('Error fetching filters:', error);
        }
        finally {
            setloading(false);
        }
    };

    const toggleStatus = async (banner) => {
        const { id } = banner;
        const updatedStatus = banner.status === 'active' ? 'inactive' : 'active';

        try {
            const response = await axios.put(`${apiurl}/admin/banner/update`, {
                id: id,
                image: banner?.image,
                status: updatedStatus,
                tag: banner?.tag
            });

            const data = await response.data;
            if (data.success) {
                fetchBanners();
            }
        } catch (error) {
            console.error('Error updating banner status:', error);
        }
    };

    const handleEditStatus = (id) => {
        navigate(`/editBanner/${id}`);
    }

    const handleDeleteBanner = async (id) => {
        try {
            const response = await axios.delete(`${apiurl}/admin/banner/delete/${id}`);

            const data = await response.data;

            if (data.success) {
                fetchBanners();
            }
        }
        catch (error) {
            console.error('Error updating filter:', error);
        }
    }

    const handleSearch = (value) => {
        const trimmedValue = value.trim();
        setSearchInput(trimmedValue);

        if (!trimmedValue) {
            setBannerData(allBanners);
            return;
        }

        console.log("trimmed value", trimmedValue);

        const updatedFilter = bannerData.filter(item =>
            item?.tag?.join(", ").toLowerCase().includes(trimmedValue.toLowerCase())
        );

        setBannerData(updatedFilter);
    };

    return (
        <Layout>
            <Container>
                {loading == true ? (
                    <DynamicLoader maintext="wait" subtext="Fetching Banner Data" />
                ) : null}
                <div className="flex flex-wrap justify-between w-full h-full  overflow-auto">
                    <div className="flex flex-col  py-2 px-2 w-full">
                        <BackHeader
                            title="Banners"
                            rightSide={
                                <div className="flex gap-3 w-[500px]">

                                    <button className="bg-[#000] hover:bg-[#e7c984] hover:text-[#000]  text-[#fff] w-[150px] p-2 rounded-md" onClick={() => navigate('/addBanner')}>
                                        Add Banner
                                    </button>

                                    <Input.search
                                        placeholder="Search Your Banner"
                                        value={searchInput}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                            }
                        />
                        <div >
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            {[
                                                "SN.",
                                                "Images",
                                                "Tags",
                                                "Status",
                                                "Action"
                                            ].map((item, index) => (
                                                <th key={index} scope="col" className="px-6 py-3">
                                                    {item}
                                                </th>
                                            ))}
                                        </tr>

                                    </thead>
                                    <tbody className="text-sm text-gray-700">
                                        {bannerData?.map((banner, index) => (
                                            <tr key={banner?.id} className="border-t">
                                                <td className="px-4 py-3">{index + 1}</td>
                                                <td className="px-4 py-3">
                                                    {banner?.image?.length >
                                                        0 ? (
                                                        <img
                                                            src={banner?.image}
                                                            alt="Item Image"
                                                            className="w-12 h-12 object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <span>No Image Available</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {banner?.tag?.join(", ")}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            onClick={() => toggleStatus(banner)}
                                                            className={`w-10 h-5 flex items-center rounded-full px-1 cursor-pointer transition-colors duration-300 ${banner.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                                                }`}
                                                        >
                                                            <div
                                                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${banner.status === 'active' ? 'translate-x-4' : ''
                                                                    }`}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs">{banner?.status}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="flex gap-1 cursor-pointer">
                                                        <CiEdit
                                                            className="p-1 text-2xl rounded-md text-green-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200 ml-1"
                                                            onClick={() => handleEditStatus(banner?.id)} />
                                                        <MdDeleteForever
                                                            className="p-1 text-2xl rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200 ml-1"
                                                            onClick={() => handleDeleteBanner(banner?.id)} />
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

export default Banner;
