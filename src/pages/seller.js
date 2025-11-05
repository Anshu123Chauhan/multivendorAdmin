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
import Swal from "sweetalert2";
import { FiUpload, FiDownload, FiRefreshCw, FiFilter } from "react-icons/fi";
import { CiLogin } from "react-icons/ci";
import * as XLSX from "xlsx";




const Seller = () => {
  const [sellerData, setsellerData] = useState([]);

  const [allAdmin, setAllAdmin] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editToggle, setEditToggle] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newFilter, setNewFilter] = useState({
    name: "",
    status: "Active",
  });
  const [loading, setloading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const token = getCookie("zrotoken");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("approved");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);


  useEffect(() => {
    fetchSeller();
  }, []);

  const fetchSeller = async () => {
    setloading(true);
    try {
      const response = await axios.get(`${apiurl}/admin/seller-List`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (response.data.success === true) {
        console.log("✅ Seller list fetched:", response?.data?.sellerList);
        setsellerData(response?.data?.sellerList || []);
        setAllAdmin(response?.data?.sellerList || []);
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
    } finally {
      setloading(false);
    }
  };


  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.warning("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);
      const res = await axios.post(`${apiurl}/admin/import-sellers`, formData, {
        headers: {
          Authorization: token,
        },
      });

      if (res?.data?.success) {
        toast.success("Vendors imported successfully!");
        setShowUploadPopup(false);
        setSelectedFile(null);
        setTimeout(() => {
          fetchSeller();
          setActiveTab("pending");
        }, 1000);
      } else {
        toast.warning(res?.data?.message || "Upload failed!");
      }

    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setUploading(false);
    }
  };


  const toggleStatus = async (admin) => {
    const { id } = admin;

    try {
      const response = await axios.put(
        `${apiurl}/admin/auth/update`,
        {
          id: id,
          username: admin?.username,
          email: admin?.email,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.data;
      if (data.success) {
        fetchSeller();
      }
    } catch (error) {
      console.error("Error updating admin status:", error);
    }
  };

  const handleEditStatus = (id) => {
    navigate(`/editSeller/${id}`);
  };

  const deleteSeller = (id) => {
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
        console.log("Deleting admin with id:", id);
        handleDeleteSeller(id);
        Swal.fire("Deleted!", "The admin has been deleted.", "success");
      }
    });
  };

  const handleDeleteSeller = async (id) => {
    try {
      const response = await axios.delete(`${apiurl}/seller/delete/${id}`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      const data = await response.data;

      if (data.success) {
        toast.success("Deleted Successfully");
        fetchSeller();
      }
    } catch (error) {
      console.error("Error updating filter:", error);
    }
  };

  const handleSearch = (value) => {
    const trimmedValue = value.trim();
    setSearchInput(trimmedValue);

    if (!trimmedValue) {
      setsellerData(allAdmin);
      return;
    }

    console.log("trimmed value", trimmedValue);

    const updatedFilter = sellerData.filter((item) =>
      item?.fullName?.toLowerCase().includes(trimmedValue.toLowerCase())
    );

    setsellerData(updatedFilter);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Show a quick loader or just disable during request
      setloading(true);

      const response = await axios.put(
        `${apiurl}/admin/sellerStatusToggle/${id}`,
        { isActive: newStatus === "Active" }, // optional body (if backend expects)
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        toast.success(`Seller status updated to ${newStatus}`);
        fetchSeller(); // refresh table after successful update
      } else {
        toast.warning(response?.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating seller status:", error);
      toast.error("Something went wrong while updating status!");
    } finally {
      setloading(false);
    }
  };

  const handleSellerLogin = async (id) => {
    try {
      setloading(true);

      const response = await axios.post(
        `${apiurl}/admin/sellerLoginByAdmin/${id}`,
        {},
        {
          headers: { Authorization: token },
        }
      );

      console.log("Seller login response:", response?.data);

      if (response?.data?.success && response?.data?.token) {
        toast.success("Redirecting to seller dashboard...");

        // ✅ Save token for seller dashboard
        localStorage.setItem("sellerToken", response.data.token);

        // ✅ Open seller dashboard in new tab
        window.open(
          `http://localhost:3017/dashboard?token=${response.data.token}`,
          "_blank"
        );
      } else {
        toast.warning(response?.data?.message || "Login failed or token missing!");
      }
    } catch (error) {
      console.error("Error during seller login:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setloading(false);
    }
  };

  // Seller Dashboard (useEffect or top of component)
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("sellerToken", token);
    }
  }, []);


  // Build the dataset currently shown in the table (by tab + search)
  const getVisibleVendors = () => {
    // start from full list; then re-apply the same filters the UI uses
    const base = allAdmin?.length ? allAdmin : sellerData;

    // filter by tab
    const tabFiltered = base.filter(s => (activeTab === "approved" ? s?.isActive : !s?.isActive));

    // filter by search (same logic as your handleSearch)
    const q = (searchInput || "").trim().toLowerCase();
    const searched = q
      ? tabFiltered.filter(it => (it?.fullName || "").toLowerCase().includes(q))
      : tabFiltered;

    return searched;
  };

  // Prepare a clean, flat list for Excel
  const makeVendorRows = (list) =>
    list.map((s, idx) => ({
      "SN": idx + 1,
      "Name": s?.fullName || "",
      "Business Name": s?.businessName || "",
      "Business Address": s?.businessAddress || "",
      "Phone no.": s?.phone || "",
      "Email": s?.email || "",
      "Status": s?.isActive ? "Active" : "Inactive",
    }));

  const exportVendorsToExcel = () => {
    const rows = makeVendorRows(getVisibleVendors());

    if (!rows.length) {
      toast.warn("No vendor data to export.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendors");

    // Optional: set column widths
    const colWidths = [
      { wch: 6 },   // SN
      { wch: 24 },  // Name
      { wch: 28 },  // Business Name
      { wch: 40 },  // Business Address
      { wch: 16 },  // Phone
      { wch: 28 },  // Email
      { wch: 10 },  // Status
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `Vendor_Details_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success("Export completed");
  };



  return (
    <Layout>
      <Container>
        {loading === true ? (
          <DynamicLoader maintext="wait" subtext="Fetching Seller Data" />
        ) : null}

        <div className="flex flex-wrap justify-between w-full">
          <div className="flex flex-col py-2 px-2 w-full">
            {/* ---- Top Header Section ---- */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-black">
                  Manage Vendors
                </h1>
                <div className="flex mt-2 space-x-6 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("approved")}
                    className={`pb-2 font-medium ${activeTab === "approved"
                      ? "text-black border-b-2 border-black"
                      : "text-gray-600"
                      }`}
                  >
                    Approved ({allAdmin.filter((s) => s.isActive === true).length})

                  </button>
                  <button
                    onClick={() => setActiveTab("pending")}
                    className={`pb-2 font-medium ${activeTab === "pending"
                      ? "text-black border-b-2 border-black"
                      : "text-gray-600"
                      }`}
                  >
                    Pending ({allAdmin.filter((s) => s.isActive === false).length})
                  </button>
                </div>
              </div>

              {/* Vendor Onboarding Button */}
              {/* <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-[#000] text-[#e7c984] border border-[#e7c984] px-4 py-2 rounded-md hover:bg-[#e7c984] hover:text-[#000] transition">
                  Vendor Onboarding ?
                </button>
              </div> */}
            </div>

            {/* ---- Search + Action Buttons ---- */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2 w-[400px]">
                <input
                  type="text"
                  placeholder="Search Vendor"
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-1 focus:ring-black focus:outline-none"
                />
                <button className="p-2 rounded-md border border-gray-300 hover:bg-gray-100">
                  <FiFilter />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2 border rounded-md hover:bg-gray-100"
                  onClick={() => setShowPopup(true)}>
                  <FiDownload />
                </button>
                <button
                  className="p-2 border rounded-md hover:bg-gray-100"
                  onClick={() => setShowUploadPopup(true)}
                >
                  <FiUpload />
                </button>
                <button className="p-2 border rounded-md hover:bg-gray-100">
                  <FiRefreshCw />
                </button>
                <button
                  onClick={() => navigate("/addseller")}
                  className="bg-[#000] hover:bg-[#e7c984] hover:text-[#000] text-[#fff] px-4 py-2 rounded-md"
                >
                  + Create Vendor
                </button>
              </div>
              {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-3">
                      <FiDownload className="text-gray-600" /> Export
                    </h2>

                    <div className="mt-4 space-y-4">
                      {["Vendor Details", "Warehouses", "Users List"].map((item) => (
                        <label
                          key={item}
                          className="flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="exportOption"
                            value={item}
                            checked={selectedOption === item}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className="w-4 h-4 bg-gray-300"
                          />
                          <span className="text-gray-800">{item}</span>
                        </label>
                      ))}
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                      If export is taking time, you will receive the vendor export file
                      via email. This could take from a few minutes to a few hours.
                      <br />
                      Mail sent to{" "}
                      <span className="text-black">
                        dynamic email @ens.enterprises
                      </span>
                    </p>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowPopup(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                        disabled={!selectedOption}
                        onClick={() => {
                          if (selectedOption === "Vendor Details") {
                            exportVendorsToExcel();
                          } else {
                            toast.info(`${selectedOption} export not implemented yet`);
                          }
                          setShowPopup(false);
                        }}
                      >
                        Export
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Popup */}
              {showUploadPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                    <h2 className="text-lg font-semibold border-b pb-3">📤 Import Vendors</h2>

                    <div className="mt-4 space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Choose .xlsx File
                      </label>
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      />

                      {selectedFile && (
                        <p className="text-xs text-gray-500 mt-1">
                          Selected file: <span className="font-medium">{selectedFile.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedFile(null);
                          setShowUploadPopup(false);
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                        disabled={!selectedFile || uploading}
                        onClick={handleFileUpload}
                      >
                        {uploading ? "Uploading..." : "Upload"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ---- Table Section ---- */}
            <div className="relative shadow-md sm:rounded-lg mt-5 overflow-auto h-[75vh]">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-20">
                  <tr>
                    <th className="px-4 py-3">
                      <input type="checkbox" />
                    </th>
                    {[
                      "SN.",
                      "Name",
                      "Business Name",
                      "Business Address",
                      "Phone no.",
                      "Email",
                      "Status",
                      "Action",
                    ].map((item, index) => (
                      <th key={index} scope="col" className="px-6 py-3">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {getVisibleVendors().map((seller, index) => (
                    <tr
                      key={seller?._id}
                      className="border-t hover:bg-gray-50 transition-all duration-300"
                    >
                      <td className="px-4 py-3">
                        <input type="checkbox" />
                      </td>
                      <td className="px-6 py-3">{index + 1}</td>
                      <td className="px-6 py-3 capitalize">
                        {seller?.fullName}
                      </td>
                      <td className="px-6 py-3">{seller?.businessName}</td>
                      <td className="px-6 py-3">{seller?.businessAddress}</td>
                      <td className="px-6 py-3">{seller?.phone}</td>
                      <td className="px-6 py-3">{seller?.email}</td>

                      <td className="px-6 py-3">
                        <div className="relative inline-block">
                          <select
                            value={seller?.isActive ? "Active" : "Inactive"}
                            onChange={(e) => handleStatusChange(seller?._id, e.target.value)}
                            className="appearance-none border border-gray-300 bg-gray-50 text-gray-700 rounded-lg px-3 py-2 pr-8 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-150 ease-in-out shadow-sm hover:shadow-md"
                          >
                            {/* Show only the opposite option depending on activeTab */}
                            {activeTab === "approved" ? (
                              <>
                                <option value="Active" disabled>
                                  Active
                                </option>
                                <option value="Inactive">Inactive</option>
                              </>
                            ) : (
                              <>
                                <option value="Inactive" disabled>
                                  Inactive
                                </option>
                                <option value="Active">Active</option>
                              </>
                            )}
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-3 flex gap-2">
                        <CiLogin
                          className="p-1 text-2xl rounded-md text-black border border-blue-200 hover:bg-gray-600 hover:text-white cursor-pointer"
                          onClick={() => handleSellerLogin(seller?._id)} title="Login as this seller"
                        />


                        <AiOutlineEye
                          className="p-1 text-2xl rounded-md text-blue-500 border border-blue-200 hover:bg-blue-500 hover:text-white cursor-pointer"
                          onClick={() =>
                            navigate(`/sellerDetails/${seller?._id}`)
                          }
                        />
                        <CiEdit
                          className="p-1 text-2xl rounded-md text-green-500 border border-green-200 hover:bg-green-500 hover:text-white cursor-pointer"
                          onClick={() => handleEditStatus(seller?._id)}
                        />
                        <MdDeleteForever
                          className="p-1 text-2xl rounded-md text-red-500 border border-red-200 hover:bg-red-500 hover:text-white cursor-pointer"
                          onClick={() => deleteSeller(seller?._id)}
                        />
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

export default Seller;
