import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiurl } from "../config/config";
import Layout from "../components/layout";
import { useUser } from "../config/userProvider";
import { Link, useNavigate } from "react-router-dom";
import { DynamicLoader } from "../components/loader";
import SearchContainer from "../components/searchContainer";
import { PopModel } from "../components/popupModels";
import { AiOutlineEye } from "react-icons/ai";
import useDebounce from "../hooks/useDedouncing";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "../config/webStorage";
const Service = () => {
  const { userData } = useUser();
  const token = getCookie("zrotoken");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState({});
  const [showImportContainer, setShowImportContainer] = useState(false);
  const {
    currentPage = 1,
    itemsPerPage = 10,
    totalItems,
    totalPages,
  } = pagination || {};
  const [current_Page, setCurrentPage] = useState(currentPage);
  const [serviceData, setServiceData] = useState();
  const [serachData, setserchData] = useState([]); // Filtered list
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      setUploading(true);
      const response = await axios.post(
        `${apiurl}/admin/service/uploadServices`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      // console.log("import file data response----------->", response)
      // alert("File uploaded successfully!");
      fetchServiceList();
      toast.success(" File imported successfully");
      // Close modal after upload
      setIsOpen(false);
      setSelectedFile(null);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
    const errorMsg = error.response.data.message;
    console.log("Dynamic Error Message:", errorMsg);
    toast.error(errorMsg[0])
    } else {
    console.log("Unknown error occurred");
    }
    } finally {
      setUploading(false);
    }
  };

  const fetchServiceList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiurl}/admin/service/getServices`, {
        // params: { page: current_Page }, // Pass current page as a query parameter
        headers: {
          Authorization: token,
          "ngrok-skip-browser-warning": "69420",
        },
      });
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
  const deleteservice = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;

    try {
      await axios.delete(`${apiurl}/admin/service/deleteServiceById/${serviceId}`, {
        headers: {
          Authorization: token,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      toast.success("service successfully deleted")
      // Filter out the deleted category from the UI
      setServiceData(
        serviceData?.filter((service) => service.id !== serviceId)
      );
      setserchData(serachData?.filter((service) => service.id !== serviceId));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <Layout>
      <ToastContainer />
      {loading ? (
        <DynamicLoader maintext="wait" subtext="Fetching Service Data" />
      ) : (
        <div className="sm:rounded-lg md:rounded-xl h-full w-full py-2">
          <div className="bg-white relative flex flex-col gap-2 w-full overflow-hidden rounded-lg sm:rounded-xl px-2 h-full p-2">
            <div className="flex flex-col md:flex-row xl:flex-nowrap sm:flex-wrap justify-between items-left md:m-2 md:p-2 gap-2 ">
              <div className="flex justify-between w-[40%] items-center">
                <div>
                  <h1 className="text-2xl md:text-3xl font-medium text-center md:mb-3 text-slate-500">
                    Services
                  </h1>
                </div>
              </div>
              <div className="flex gap-4 sm:flex-nowrap flex-wrap items-center w-full">
                <a
                  href="/sampleFile.xlsx" 
                  download="sampleFile.xlsx"
                  className="bg-green-400 hover:bg-green-500 hover:text-[#000] py-2 px-4 rounded-md shadow-md transition-all duration-300 whitespace-nowrap"
                >
                  Download Import Sample File
                </a>
                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-[#000] hover:bg-[#e7c984] hover:text-[#000] text-white py-2 px-4 rounded-md shadow-md  transition whitespace-nowrap"
                >
                  Import Files
                </button>

                <Link to="/addservice">
                  <button className="bg-[#000] hover:bg-[#e7c984] hover:text-[#000]  text-white py-2 px-4 rounded-md shadow-md transition whitespace-nowrap">
                    Add Service
                  </button>
                </Link>
                <SearchContainer
                  placeholder="Search Services..."
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="relative overflow-y-auto h-full sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 border border-slate-200">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                  <tr>
                    {[
                      "Sn.",
                      "Image",
                      "Service Code",
                      "Service Name",
                      "Category Name",
                      "Subcategory Name",
                      // "Description",
                      "Duration",
                      // "Male/Female",
                      "Action",
                    ].map((item, index) => (
                      <th key={index} scope="col" className="px-6 py-3 text-nowrap">
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
                        <td className="pl-4 sm:px-6 py-4 align-middle">
                          {index + 1}
                        </td>
                        <td className="pl-4 sm:px-6 py-4 align-middle">
                          {item?.images?.some((img) => img.isDefault === 1) ? (
                            <img
                              src={
                                item.images.find((img) => img.isDefault === 1)
                                  ?.url
                              }
                              alt="service_image"
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <span>No Image Available</span>
                          )}
                        </td>

                        <td className="pl-4 sm:px-6 py-4 align-middle capitalize">
                          {item?.serviceCode}
                        </td>
                        <td className="pl-4 sm:px-6 py-4 align-middle capitalize">
                          {item?.serviceName}
                        </td>

                        <td className="pl-4 sm:px-6 py-4 align-middle capitalize">
                          {item?.categoryName}
                        </td>
                        <td className="pl-4 sm:px-6 py-4 align-middle capitalize">
                          {item?.subCategoryName}
                        </td>

                        {/* <td className="pl-4 sm:pl-6 py-4">{item?.timestamp}</td> 
                        <td className="pl-4 sm:pl-6 py-4 align-middle capitalize">{item?.description}</td>*/}
                        <td className="pl-4 sm:px-6 py-4 align-middle capitalize">
                          {item?.duration} Mins
                        </td>
                        {/* <td className="pl-4 sm:pl-6 py-4 align-middle capitalize">{item?.gender}</td> */}
                        <td className="pl-2 sm:px-6 py-4  align-middle capitalize">
                          <div className="flex gap-2">
                            <div className="text-2xl flex ">
                              <AiOutlineEye
                                className="p-1 rounded-md text-blue-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200"
                                onClick={() =>
                                  navigate(`/ServiceDetails/view/${item?.id}`)
                                }
                              />
                              <CiEdit
                                onClick={() =>
                                  navigate(
                                    `/editServices/${item?.id}`
                                  )
                                }
                                className="p-1 rounded-md text-green-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200 ml-1"
                              />
                              <MdDeleteForever
                                className="p-1 rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200 ml-1"
                                onClick={() => deleteservice(item?.id)}
                              />
                            </div>
                          </div>
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
        </div>
      )}

      {showImportContainer && (
        <PopModel setShowImportContainer={setShowImportContainer}></PopModel>
      )}

      {/* Modal */}
      {isOpen && !uploading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-96 backdrop-blur-md">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold">Import Files</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="border p-2 w-full"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col items-center mt-4 space-y-3">
              <div className="flex justify-end space-x-2 w-full">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  disabled={uploading}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show DynamicLoader Below the Button when Uploading */}
      {uploading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <DynamicLoader maintext="Wait" subtext="Fetching Service Data..." />
        </div>
      )}
    </Layout>
  );
};

export default Service;
