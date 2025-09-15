import React, { useState, useEffect } from "react";
import Layout, { Container } from "../components/layout";
import { DynamicLoader } from "../components/loader";
import BackHeader from "../components/backHeader";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { apiurl } from "../config/config";
import { useNavigate, useParams } from "react-router-dom";
import { getCookie } from "../config/webStorage";
import VideoPlayer from "../components/videoPlayer";
import SearchContainer from "../components/searchContainer";

const AddVideoService = () => {
  const token = getCookie("zrotoken");
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pagination, setPagination] = useState({});
   const [searchInput, setSearchInput] = useState("");
  const {
    currentPage = 1,
    itemsPerPage = 10,
    totalItems,
    totalPages,
  } = pagination || {};
  const [current_Page, setCurrentPage] = useState(currentPage);
  const [serviceData, setServiceData] = useState();
  const [formData, setFormData] = useState({
    video: "",
  });

  const [serachData, setserchData] = useState([]);
  const [errors, setErrors] = useState({
    video: "",
  });

  const [selectedService, setSelectedService] = useState([]);
  const [getServiceDataById, setServiceDataById] = useState([]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const fetchServiceList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiurl}/admin/service/service-listing`,
        {
          // params: { page: current_Page }, // Pass current page as a query parameter
          headers: {
            Authorization: token,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      console.log(response.data.data);
      if (response?.data?.data?.length > 0) {
        setServiceData(response?.data?.data || []);
        setserchData(response?.data?.data || []);
        setPagination(response?.data);
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceList();
  }, []);

  const handleVideoUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error("Please select a file.");
      return;
    }

    const input = e.target; // reference the input
    const file = input.files[0]

    try {
      setUploading(true);
      // const file = e.target.files[0];

       if (file.size > 40 * 1024 * 1024) {
              toast.error("Video is too large! Max 40MB.");
              input.value = "";
              return;
        }

      if (!file.type.startsWith("video/")) {
        toast.error("Only video files are allowed.");
        setUploading(false);
        input.value = "";
        return;
      }

      const formData = new FormData();
      formData.append("video", file);
      //   formData.append("upload_preset", "lakmesalon");
      //   formData.append("cloud_name", "dv5del8nh");

      const response = await axios.post(
        // "https://3638-103-206-131-194.ngrok-free.app/api/admin/service/upload-video",
        `${apiurl}/admin/service/upload-video`,
        formData
      );
      const secure_url = response.data.url;
      console.log("Uploaded Video URL: response", response);
      toast.success("Video uploaded successfully!");

      setFormData((prev) => ({ ...prev, video: secure_url }));
    } catch (error) {
      console.error(
        "Video upload error:",
        error.response?.data || error.message
      );
      toast.error("Video upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSelectCheckbox = (id) => {
    setSelectedService(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((itemId) => itemId !== id)
          : [...new Set([...prevSelected, id])] // Prevent duplicates
    );
  };
  console.log("selectedService---------->", selectedService);
  console.log("selectedService formData.video---------->", formData.video);

  const handleCreateService = async () => {
    try {
      setLoading(true);
      const payload = {
        url: formData.video.publicURL,
        serviceIds: selectedService,
        isDefault: 1,
      };
      const response = await axios.post(
        `${apiurl}/admin/video/create`,
        payload,
        {
          headers: {
            Authorization: token,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      console.log("create service with video------------->", response);
      if (response.data.success === true) {
        setLoading(false);
        toast.success("Service created successfully");
        navigate("/videomapping");
      }
    } catch (error) {
      setLoading(false);
      console.error("service create error!", error);
    }
  };

  const fetchVideoById = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiurl}/admin/video/getVideo/${id}`, {
        headers: {
          Authorization: token,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      console.log("video get by id", response.data.data);
      if (response?.data?.success === true) {
        setServiceDataById(response?.data?.data);
        if (response?.data?.success === true) {
          const selectedIds =
            response?.data?.data?.services?.map((s) => s.serviceId) || [];
          setServiceDataById(response?.data?.data);
          setSelectedService(selectedIds); // ✅ Populate selectedService for editing
        }
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchVideoById();
    }
  }, [id]);

  console.log(
    "getServiceDataById?.services---------------->",
    getServiceDataById?.services
  );
  console.log(
    "getServiceDataById?.video?.url---------------->",
    getServiceDataById?.video?.url
  );

  console.log(
    "formData.video.publicURL------------->>",
    formData.video.publicURL
  );

  const handleUpdateVideoService = async () => {
    try {
      setLoading(true);
      const payload = {
        url: formData.video.publicURL,
        serviceIds: selectedService,
        isDefault: 1,
      };
      const response = await axios.put(`${apiurl}/admin/video/${id}`, payload, {
        headers: {
          Authorization: token,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      console.log(
        "update service with video------------->",
        response.data.data
      );
      if (response.data?.success === true) {
        toast("Service Updated successfully");
        setLoading(false);
        navigate("/videomapping");
      }
    } catch (error) {
      setLoading(false);
      console.error("service create error!", error);
    }
  };
    const handleSearch = (value) => {
    setSearchInput(value.trim());

    if (!value.trim()) {
      setCurrentPage(1);
      setserchData(serviceData);
      return;
    }

    // Filter store data based on store name (handle case sensitivity)
    const filteredData = serviceData?.filter(
      (store) =>
        store?.serviceName?.toLowerCase().includes(value.toLowerCase()) ||
        store?.serviceCode?.toLowerCase().includes(value.toLowerCase()) ||
        store?.description?.toLowerCase().includes(value.toLowerCase()) ||
        store?.categoryName?.toLowerCase().includes(value.toLowerCase()) ||
        store?.subCategoryName?.toLowerCase().includes(value.toLowerCase())
    );
    console.log(filteredData);
    setCurrentPage(1); // Reset pagination to first page
    setserchData(filteredData);
  };

  return (
    <Layout>
      <Container>
        {loading == true ? (
          <DynamicLoader maintext="wait" subtext="Fetching service Data" />
        ) : null}
        <div className="flex flex-wrap justify-between w-full h-full  overflow-auto">
          <ToastContainer />
          <div className="flex flex-col  py-2 px-2 w-full">
            <BackHeader
              title={id ? "Update Video" : "Add Video"}
              backButton={true}
              link="/videomapping"
            />
            <div>
              <div className="bg-white flex flex-col gap-2 w-full h-full rounded-lg sm:rounded-xl px-2 p-2">
                <div className="flex flex-col gap-6 m-auto">
                  {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
                  <div className="flex gap-6 max-w-3xl">
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        Upload Video
                      </label>
                      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center mb-4">
                        {uploading ? (
                          <small className="text-blue-500">Uploading...</small>
                        ) : formData?.video ||
                          getServiceDataById?.video?.url ? (
                          <div className="object-cover rounded-lg w-48">
                            {formData.video?.publicURL ||
                            getServiceDataById?.video?.url.endsWith(".zip") ? (
                              <VideoPlayer
                                zipFile={
                                  formData.video?.publicURL ||
                                  getServiceDataById?.video?.url
                                }
                              />
                            ) : (
                              <video
                                controls
                                className="object-cover rounded-lg w-48"
                                src={
                                  formData.video?.publicURL ||
                                  getServiceDataById?.video?.url
                                }
                              />
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            No video uploaded
                          </span>
                        )}

                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                          id="fileUpload"
                        />
                        <label
                          htmlFor="fileUpload"
                          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer mt-2"
                        >
                          {id ? "Update Video" : "Add Video"}
                        </label>
                        <span className="text-gray-500 text-sm mt-2">
                          or drag and drop to upload
                        </span>
                      </div>

                      {errors.video && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.video}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                <div className="w-1/3 pb-3">
                  <SearchContainer
                    placeholder="Search Services..."
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                  <div className="relative overflow-y-auto h-full sm:rounded-lg">
                  
                    <table className="w-full text-sm text-left text-gray-500">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                        <tr>
                          {[
                            "Sn.",
                            "Selected",
                            "Service Code",
                            "Service Name",
                          ].map((item, index) => (
                            <th key={index} scope="col" className="px-6 py-3">
                              {item}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {serachData &&
                          serachData.length > 0 &&
                          serachData.map((item, index) => (
                            <tr
                              style={{ lineHeight: "1" }}
                              key={item.id}
                              className={`${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              } border-b cursor-pointer h-10`}
                            >
                              <td className="pl-4 sm:pl-6 py-4 align-middle">
                                <div className="flex items-center space-x-2">
                                  <span>{index + 1}</span>
                                </div>
                              </td>
                              <td className="pl-4 sm:pl-6 py-4 align-middle">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    className="accent-orange-500 w-6 h-6 border border-gray-500 rounded-md"
                                    onChange={() =>
                                      handleSelectCheckbox(item.id)
                                    }
                                    checked={selectedService.includes(item.id)}
                                  />
                                </div>
                              </td>

                              <td className="pl-4 sm:pl-6 py-4 align-middle capitalize">
                                {item?.serviceCode}
                              </td>
                              <td className="pl-4 sm:pl-6 py-4 align-middle capitalize">
                                {item?.serviceName}
                              </td>
                            </tr>
                          ))}
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
                <div>
                  <button
                    className="px-4 py-2 rounded-md font-semibold bg-orange-600 text-white float-right relative z-[999]"
                    onClick={
                      id ? handleUpdateVideoService : handleCreateService
                    }
                  >
                    {id ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default AddVideoService;
