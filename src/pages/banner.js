import React, { useState, useEffect } from "react";
import Layout, { Container } from "../components/layout";
import BackHeader from "../components/backHeader";
import Input from "../components/inputContainer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiurl } from "../config/config";
import { DynamicLoader } from "../components/loader";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { getCookie } from "../config/webStorage";
import Swal from "sweetalert2";


const Banner = () => {
  const token = getCookie("zrotoken");
  const [bannerData, setBannerData] = useState([]);
  const [allBanners, setAllBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiurl}/admin/banner`, {
        headers: { Authorization: token },
      });
      if (response.data.success) {
        setBannerData(response.data.data);
        setAllBanners(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = (id) => {
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
        handleDelete(id);
        Swal.fire("Deleted!", "The Banner has been deleted.", "success");
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${apiurl}/admin/banner/${id}`, {
        headers: { Authorization: token },
      });

      if (response.data.success) fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  const handleSearch = (value) => {
    const trimmed = value.trim();
    setSearchInput(trimmed);
    if (!trimmed) return setBannerData(allBanners);

    const filtered = allBanners.filter(
      (item) =>
        item.description?.toLowerCase().includes(trimmed.toLowerCase()) ||
        item.button1?.toLowerCase().includes(trimmed.toLowerCase()) ||
        item.button2?.toLowerCase().includes(trimmed.toLowerCase())
    );
    setBannerData(filtered);
  };

  return (
    <Layout>
      <Container>
        {loading && (
          <DynamicLoader
            maintext="Please wait"
            subtext="Fetching Banner Data"
          />
        )}
        <div className="flex flex-wrap justify-between w-full h-full overflow-auto">
          <div className="flex flex-col py-2 px-2 w-full">
            <BackHeader
              title="Banners"
              rightSide={
                <div className="flex gap-3 w-[500px]">
                  <button
                    className="bg-black hover:bg-yellow-200 hover:text-black text-white w-[150px] p-2 rounded-md"
                    onClick={() => navigate("/addBanner")}
                  >
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
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr className="max-w-64">
                    {[
                      "SN.",
                      "Media",
                      "Description",
                      "Button 1",
                      "Button 2",
                      "Status",
                      "Action",
                    ].map((item, index) => (
                      <th key={index} className="px-4 py-3">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {bannerData?.map((banner, index) => (
                    <tr key={banner._id} className="border-t">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        {banner.image ? (
                          banner.image.endsWith(".mp4") ? (
                            <video
                              src={banner.image}
                              className="w-52 h-auto object-cover rounded"
                              autoPlay
                              muted
                              loop
                              controls
                            />
                          ) : (
                            <img
                              src={banner.image}
                              className="w-52 h-auto object-cover rounded"
                            />
                          )
                        ) : (
                          <span>No Media</span>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-64">
                        {banner.description}
                      </td>
                      <td className="px-4 py-3">{banner.button1}</td>
                      <td className="px-4 py-3">{banner.button2}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm capitalize font-semibold ${
                              banner.status === "active"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {banner.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <CiEdit
                            className="p-1 text-2xl rounded-md text-green-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200"
                            onClick={() =>
                              navigate(`/editBanner/${banner._id}`)
                            }
                          />
                          <MdDeleteForever
                            className="p-1 text-2xl rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200"
                            onClick={() => deleteBanner(banner._id)}
                          />
                        </div>
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

export default Banner;
