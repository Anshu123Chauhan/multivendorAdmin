import React, { useState, useEffect } from "react";
import Layout, { Container } from "../components/layout";
import { DynamicLoader } from "../components/loader";
import BackHeader from "../components/backHeader";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { apiurl } from "../config/config";
import { useNavigate, useParams } from "react-router-dom";
import { getCookie } from "../config/webStorage";
import SearchContainer from "../components/searchContainer";
const AddImageService = () => {
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
    image: "",
  });

  const [serachData, setserchData] = useState([]);
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

  const handleImageUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error("Please select a file.");
      return;
    }
    try {
      setUploading(true);
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed.");
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      //   formData.append("upload_preset", "lakmesalon");
      //   formData.append("cloud_name", "dv5del8nh");

      const response = await axios.post(
        `${apiurl}/admin/upload-image`,
        formData
      );
      const secure_url = response.data.url;
      console.log("Uploaded Image URL: response", response);
      toast.success("Image uploaded successfully!");

      setFormData((prev) => ({ ...prev, image: secure_url }));
    } catch (error) {
      console.error(
        "Image upload error:",
        error.response?.data || error.message
      );
      toast.error("Image upload failed");
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
  console.log("selectedService formData.image---------->", formData.image);

  const handleCreateService = async () => {
    try {
      setLoading(true);
      const payload = {
        url: formData.image,
        serviceIds: selectedService,
        isDefault: 1,
      };
      const response = await axios.post(
        `${apiurl}/admin/image/create`,
        payload,
        {
          headers: {
            Authorization: token,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      console.log("create service with image------------->", response);
      if (response.data.success === true) {
        setLoading(false);
        toast.success("Service created successfully");
        navigate("/imagemapping");
      }
    } catch (error) {
      setLoading(false);
      console.error("service create error!", error);
    }
  };

  const fetchImageById = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiurl}/admin/image/getImage/${id}`, {
        headers: {
          Authorization: token,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      console.log("image get by id", response.data.data);
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
      fetchImageById();
    }
  }, [id]);

  console.log(
    "getServiceDataById?.services---------------->",
    getServiceDataById?.services
  );
  console.log(
    "getServiceDataById?.getServiceDataById?.image?.url---------------->",
    getServiceDataById?.image?.url
  );

  const handleUpdateImageService = async () => {
    try {
      setLoading(true);
      const payload = {
        url: formData.image,
        serviceIds: selectedService,
        isDefault: 1,
      };
      const response = await axios.put(`${apiurl}/admin/image/${id}`, payload, {
        headers: {
          Authorization: token,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      console.log("update service with image------------->", response);
      if (response.data.success === true) {
        setLoading(false);
        toast.success("Service Updated successfully");
        navigate("/imagemapping");
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
              title={id ? "Update Image" : "Add Image"}
              backButton={true}
              link="/imagemapping"
            />
            <div>
              <div className="bg-white flex flex-col gap-2 w-full h-full rounded-lg sm:rounded-xl px-2 p-2">
                <div className="flex flex-col gap-6 m-auto">
                  {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
                  <div className="flex gap-6 max-w-3xl">
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        Upload Image
                      </label>
                      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center mb-4">
                        {uploading ? (
                          <small className="text-blue-500">Uploading...</small>
                        ) : formData?.image ||
                          getServiceDataById?.image?.url ? (
                          <img
                            src={
                              formData?.image
                                ? formData.image
                                : getServiceDataById?.image?.url
                            }
                            alt="Uploaded"
                            className="w-48 object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-400">
                            No image uploaded
                          </span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="fileUpload"
                        />
                        <label
                          htmlFor="fileUpload"
                          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer mt-2"
                        >
                          {id ? "Update Image" : "Add Image"}
                        </label>
                        <span className="text-gray-500 text-sm mt-2">
                          or drag and drop to upload
                        </span>
                      </div>
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
                      id ? handleUpdateImageService : handleCreateService
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

export default AddImageService;
