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
import VideoPlayer from "../components/videoPlayer";

const VideoMapping = () => {
  const token = getCookie("zrotoken");
  const [serviceList, setServiceList] = useState([]);
  const [allService, setAllService] = useState([]);
  const [loading, setloading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchServiceList();
  }, []);

  const fetchServiceList = async () => {
    setloading(true);
    try {
      const response = await axios.get(`${apiurl}/admin/video/list`, {
        headers: {
          Authorization: token,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      console.log("service video/list", response);
      if (response.data.success === true) {
        setServiceList(response?.data?.data);
        setAllService(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
    } finally {
      setloading(false);
    }
  };

  const handleEditStatus = (id) => {
    navigate(`/editvideo/${id}`);
  };

  const handleDeleteVideoService = async (id) => {
    try {
      const response = await axios.delete(`${apiurl}/admin/video/${id}`);
      if (response.data.success === true) {
        toast.success("Video service deleted successfully");
        fetchServiceList();
      }
    } catch (error) {
      console.error("Error updating filter:", error);
    }
  };

  const handleSearch = (value) => {
    const trimmedValue = value.trim();
    setSearchInput(trimmedValue);

    if (!trimmedValue) {
      setServiceList(allService);
      return;
    }

    console.log("trimmed value", trimmedValue);

    const updatedFilter = serviceList.filter((item) =>
      item?.tag?.join(", ").toLowerCase().includes(trimmedValue.toLowerCase())
    );

    setServiceList(updatedFilter);
  };

  return (
    <Layout>
      <Container>
        {loading == true ? (
          <DynamicLoader maintext="wait" subtext="Fetching Service Data" />
        ) : null}
        <div className="flex flex-wrap justify-between w-full h-full  overflow-auto">
          <div className="flex flex-col  py-2 px-2 w-full">
            <BackHeader
              title="Video Mapping"
              rightSide={
                <div className="flex gap-3 w-[500px]">
                  <button
                    className="bg-[#000] hover:bg-[#e7c984] hover:text-[#000]  text-[#fff] w-[240px] p-2 rounded-md"
                    onClick={() => navigate("/addVideo")}
                  >
                    Add Video Services
                  </button>

                  <Input.search
                    placeholder="Search Your Video"
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
                      {["SN.", "Video", "Services", "Action"].map(
                        (item, index) => (
                          <th key={index} scope="col" className="px-6 py-3">
                            {item}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {serviceList.length > 0 ? (
                      serviceList.map((item, index) => (
                        <tr key={item?.id} className="border-t">
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3 flex">
                            <div className="object-cover rounded-lg w-48">
                              {item?.videoUrl?.length > 0 ? (
                                item.videoUrl.toLowerCase().endsWith(".zip") ? (
                                  <VideoPlayer zipFile={item.videoUrl} />
                                ) : (
                                  <video
                                    controls
                                    className="object-cover rounded-lg w-48"
                                    src={item.videoUrl}
                                  />
                                )
                              ) : (
                                <span>No Video Available</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {item?.services?.length > 0 ? (
                              item.services.map((service, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs text-gray-600"
                                >
                                  <span className="text-black font-semibold">
                                    {idx + 1}.
                                  </span>{" "}
                                  {service.serviceName}
                                  {idx !== item.services.length - 1 && (
                                    <span>, </span>
                                  )}
                                </div>
                              ))
                            ) : (
                              <span>—</span>
                            )}
                          </td>

                          <td>
                            <span className="flex gap-1 cursor-pointer">
                              <CiEdit
                                className="p-1 text-2xl rounded-md text-green-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200 ml-1"
                                onClick={() => handleEditStatus(item?.videoId)}
                              />
                              <MdDeleteForever
                                className="p-1 text-2xl rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200 ml-1"
                                onClick={() =>
                                  handleDeleteVideoService(item?.videoId)
                                }
                              />
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-4 text-gray-400"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
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

export default VideoMapping;
