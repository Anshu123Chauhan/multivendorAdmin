import React, { useState, useEffect } from "react";
import Layout, { Container } from "../components/layout";
import axios from "axios";
import { useUser } from "../config/userProvider";
import { apiurl } from "../config/config";
import { Link, useNavigate } from "react-router-dom";
import { DynamicLoader } from "../components/loader";

import SearchContainer from "../components/searchContainer";
import { PopModel } from "../components/popupModels";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import Cookies from "js-cookie";
import useDebounce from "../hooks/useDedouncing";
import { toast } from "react-toastify";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
const Stores = () => {
  const [showImportContainer, setShowImportContainer] = useState(false);
  const navigate = useNavigate();
  const { permissions } = useUser();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [storeData, setstoreData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  
  const [editStatusModal, setEditStatusModal] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [serachData, setserchData] = useState([]); // Filtered list
  const [statusChange, setStatusChange] = useState(false);
  const [pagination, setPagination] = useState({});
  const {
    currentPage = 1,
    itemsPerPage = 10,
    totalItems,
    totalPages,
  } = pagination;

  const [current_Page, setCurrentPage] = useState(currentPage);
 

  const [error, setError] = useState(null);
  const { userData, token } = useUser();
  let vendorObjId = userData?.vendorDetails?.vendorObjId;


  const Token = Cookies.get("zrotoken");
  const debouncedata = useDebounce(searchInput, 500);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const fetchStoreList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiurl}/api/store/storeListing`, {
        params: { page: current_Page }, // Pass current page as a query parameter
        headers: {
          Authorization: token,
        },
      });
 
      if (response?.data?.data?.length > 0) {
        setstoreData(response?.data?.data|| []);
        setserchData(response?.data?.data || []);
        setPagination(response?.data);
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchInput(value.trim()); // Trim input to remove leading/trailing spaces
  
    if (!value.trim()) {
      // If input is empty, reset to original store data
      setCurrentPage(1);
      setserchData(storeData);
      return;
    }
  
    // Filter store data based on store name (handle case sensitivity)
    const filteredData = storeData.filter(
      (store) => store?.storeName?.toLowerCase().includes(value.toLowerCase()) || store?.region?.toLowerCase().includes(value.toLowerCase()));
    console.log(filteredData)
  
    setCurrentPage(1); // Reset pagination to first page
    setserchData(filteredData);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (!searchInput.trim()) {
        fetchStoreList();
      } 
    }, 500);
    return () => clearTimeout(debounce);
  }, [searchInput, current_Page]);

  const openEditStatusModal = (id) => {
    setSelectedStoreId(id);
    setEditStatusModal(true);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const ViewHandler = (id) => {
    navigate(`/StoreDetails/view/${id}`);
  };

  const handleStatusChange = async (storeId, currentStatus) => {
  
    try {
      const status = currentStatus === true ? false : true;
      const data = JSON.stringify({ id: storeId, status });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${apiurl}/api/storeRoute/storeStatusUpdates`,
        headers: {
          "Content-Type": "application/json",
          Authorization: Token,
        },
        data: data,
      };

      const response = await axios.request(config);
      if (response.data.success === true) {
        const updatedData = response.data.map((store) =>
          store._id === storeId ? { ...store, status: status } : store
        );
        setserchData(response.data);
        setStatusChange(!statusChange); // Trigger refresh
      }
    } catch (error) {
      console.error("Error updating store status:", error);
    } finally {
      fetchStoreList();
      setEditStatusModal(false);
    }
  };

  const handleSearchStore = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${apiurl}/api/storeRoute/storeSearch?search=${searchInput}`,
        {
          headers: {
            Authorization: Token,
            "Content-Type": "application/json",
          },
        }
      );
    
      if (response?.status === 200) {
        setLoading(false);
        // setstoreData(response.data ? response.data : []);
        setserchData(response.data.data ? response.data.data : []);
        setPagination(response?.data);
      }
      if (response && response.data.data.length == 0) {
        toast.error("No Data Found For This Query");
      }
    } catch (error) {
      console.error(
        "Error fetching template:",
        error.response?.data || error.message
      );
      setLoading(false);
    }
  };
  const [isChecked, setIsChecked] = useState(false);
  const deleteStore = async (storeId) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;
  
    try {
      await axios.delete(`${apiurl}/api/store/deleteStore/${storeId}`, {
        headers: {
          Authorization: token,
        },
      });
  
      // Filter out the deleted category from the UI
      setstoreData(storeData.filter((store) => store._id !== storeId));
      setserchData(serachData.filter((store) => store._id !== storeId));
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  return (
    <Layout>
      <Container>
        {loading === true ? (
          <DynamicLoader maintext="wait" subtext="Fetching Store Data" />
        ) : (
          <div className="bg-white/100 relative overflow-auto rounded-2xl  h-full">
            <div className="flex flex-col md:flex-row justify-between items-center my-2 md:mx-2 md:my-2 md:p-1 gap-2 md:gap-0">
              <div className="flex justify-between w-full items-center">
                <div>
                  <h1 className="text-2xl md:text-3xl font-medium text-center md:mb-3 text-slate-500">
                    Stores
                  </h1>
                </div>
                {/* <div className="flex gap-2 md:hidden">
                 <button
                   className="border text-xs sm:text-base  sm:p-2 px-3 rounded-md border-zinc-900 hover:bg-zinc-900  hover:text-white"
                   onClick={() => setShowImportContainer(true)}
                 >
                   Import
                 </button>
                 <Link to="/stores/add" className="">
                   <ButtonContainer icon={<IoAddOutline />}></ButtonContainer>
                 </Link>
               </div> */}
              </div>
              
              <div className="flex md:gap-2 items-center w-[100%] md:w-[60%]">
                <Link to="/createstore"><button className="bg-[#ea580c] hover:bg-[#e7c984] hover:text-[#000] text-[#fff] w-[150px] p-2 rounded-md">Add Store</button></Link>
                <SearchContainer
                  placeholder={"Search Store..."}
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              {/* <div className="flex md:gap-2 items-center w-full md:w-[40%]">
               <div className="hidden md:flex gap-2">
                 <button
                   className="border  p-2 px-3 rounded-md border-zinc-900 hover:bg-zinc-900  hover:text-white"
                   onClick={() => setShowImportContainer(true)}
                 >
                   Import
                 </button>
                 <Link to="/stores/add">
                   <ButtonContainer icon={<IoAddOutline />}>
                     Create
                   </ButtonContainer>
                 </Link>
               </div>
               <SearchContainer
                 value={searchInput}
                 placeholder={"Search Store..."}
                 onChange={(e) => setSearchInput(e.target.value)}
               />
             </div> */}
            </div>

            <div className="overflow-scroll relative overflow-x-auto border-2 border-slate-100 sm:rounded-lg h-[100%] md:h-[75%]">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase sticky top-0 bg-gray-50 z-20">
                  <tr>
                    {[
                      "SN.",
                    
                      "Store name",
                      "Region",

                      "Action",
                    ].map((item, index) => (
                      <th key={index} scope="col" className="px-6 py-3">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {serachData.length > 0 &&
                    serachData.map((item, index) => {
                    

                    
                      return (
                        <tr
                          key={item?._id}
                          className="border-b border-gray-200 cursor-pointer"
                          // onClick={() => storeDetails(item?._id)}
                        >
                          <td className="px-6 py-4">
                            {(currentPage - 1) * 10 + (index + 1)}
                          </td>
                          
                          <td className="px-4 py-3 sm:px-6 font-medium text-gray-900 whitespace-nowrap capitalize">
                            {item?.storeName}
                          </td>
                          <td className="px-4 py-3 sm:px-6 font-medium text-gray-900 whitespace-nowrap capitalize">
                            {item?.region}
                          </td>
                          

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-2xl">
                              <AiOutlineEye
                                onClick={() => ViewHandler(item?._id)}
                                className="p-1 rounded-md text-blue-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200"
                              />
                                <CiEdit
                                onClick={() => navigate(`/editStore/${item?._id}`)}
                                className="p-1 rounded-md text-green-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200"
                              />
                              <MdDeleteForever
                                className="p-1 rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200 ml-1"
                                onClick={() => deleteStore(item?._id)}
                              />
                              {/* <div className="">
                                <label className="flex cursor-pointer select-none items-center">
                                  <div className="relative w-[40px] h-[24px]">
                                    <input
                                      type="checkbox"
                                      checked={
                                        item.admin_approve_status === true
                                      }
                                      onChange={() =>
                                        openEditStatusModal(item?._id)
                                      }
                                      className="sr-only"
                                    />
                                    <div
                                      className={`block h-full w-full rounded-full transition-colors ${
                                        item.admin_approve_status === true
                                          ? "bg-blue-500"
                                          : "bg-gray-400"
                                      }`}
                                    ></div>
                                    <div
                                      className={`absolute left-1 top-1 h-[16px] w-[16px] rounded-full bg-white shadow transition-transform ${
                                        item.admin_approve_status === true
                                          ? "translate-x-[16px]"
                                          : ""
                                      }`}
                                    ></div>
                                  </div>
                                </label>
                              </div> */}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center mt-2 space-x-4">
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
            </div>
          </div>
        )}
        {editStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4">Confirm Status Change</h2>
              <p>
                Are you sure you want to
                {serachData.find((store) => store._id === selectedStoreId)
                  ?.admin_approve_status === true
                  ? "Disabled"
                  : "Enabled"}
                this store?
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => {
                    const currentStatus = serachData.find(
                      (store) => store._id === selectedStoreId
                    )?.admin_approve_status;
                    handleStatusChange(selectedStoreId, currentStatus);
                  }}
                >
                  Yes,{" "}
                  {serachData.find((store) => store._id === selectedStoreId)
                    ?.admin_approve_status === true
                    ? "Store will be Disabled"
                    : "Store will be Enabled"}
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-black rounded"
                  onClick={() => setEditStatusModal(false)} // Close the modal without action
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>

      {showImportContainer && (
        <PopModel setShowImportContainer={setShowImportContainer}></PopModel>
      )}
    </Layout>
  );
};

export default Stores;
