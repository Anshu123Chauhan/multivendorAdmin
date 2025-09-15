import React, { useState, useEffect } from "react";
import Input from "../components/inputContainer";
import Layout, { Container } from "../components/layout";
import BackHeader from "../components/backHeader";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";
import { apiurl } from "../config/config";
import { toast } from "react-toastify";
import { DynamicLoader } from "../components/loader";
import "react-toastify/dist/ReactToastify.css";

function PriceMapping() {
  const [searchInput, setSearchInput] = useState("");
  const [allPriceCodes, setAllPriceCodes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [priceCodes, setPriceCodes] = useState([]);
  const [formData, setFormData] = useState({
    priceCode: "",
  });

  const handleSearch = (value) => {
    const trimmedValue = value.trim();
    setSearchInput(trimmedValue);

    if (!trimmedValue) {
      setPriceCodes(allPriceCodes);
      return;
    }

    const filtered = allPriceCodes.filter((item) =>
      item.priceCode.toLowerCase().includes(trimmedValue.toLowerCase())
    );
    setPriceCodes(filtered);
  };

  useEffect(() => {
    fetchPriceCodes();
  }, []);

  const fetchPriceCodes = async () => {
    try {
      const response = await axios.get(`${apiurl}/admin/pricecode/getAll`);
      if (response.data.success === true) {
        setAllPriceCodes(response.data.data);
        setPriceCodes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching price codes:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    try {
      if (editMode) {
        const response = await axios.put(
          `${apiurl}/admin/pricecode/update`,
          { ...formData, id: editId },
          config
        );

        if (response.data.success === true) {
          fetchPriceCodes();
          toast.success(response.data.message);
          closeModal();
        } else {
          toast.error("Failed to update Price Code.");
        }
      } else {
        const response = await axios.post(
          `${apiurl}/admin/pricecode/create`,
          formData,
          config
        );

        if (response.data.success === true) {
          fetchPriceCodes();
          toast.success(response.data.message);
          closeModal();
        } else {
          toast.error("Failed to add Price Code.");
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.warn(err.response.data.message);
      } else {
        console.error(`Error saving price code: ${err.message}`);
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (id) => {
    try {
      const response = await axios.get(`${apiurl}/admin/pricecode/get/${id}`);
      if (response.data.success === true) {
        setFormData({ priceCode: response.data.data.priceCode });
        setEditMode(true);
        setEditId(id);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching price code by ID:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.delete(
        `${apiurl}/admin/pricecode/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success === true) {
        toast.success(
          response.data.message || "Price Code deleted successfully!"
        );
        fetchPriceCodes();
      } else {
        toast.error("Failed to delete Price Code.");
      }
    } catch (error) {
      console.error("Error deleting price code:", error);
      toast.error("Something went wrong.");
    }
  };

  const openAddModal = () => {
    setFormData({ priceCode: "" });
    setEditMode(false);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setEditId(null);
    setFormData({ priceCode: "" });
  };

  return (
    <Layout>
      <Container>
        {loading == true ? (
          <DynamicLoader maintext="wait" subtext="Fetching Category Data" />
        ) : null}
        <div className="flex flex-wrap justify-between w-full h-full  overflow-auto">
          <div className="flex flex-col  py-2 px-2 w-full">
            <BackHeader
              title="Price Code Mapping"
              rightSide={
                <div className="flex gap-3 w-[500px]">
                  <button
                    className="bg-[#000] hover:bg-[#e7c984] hover:text-[#000] text-[#fff] w-[180px] p-2 rounded-md"
                    onClick={openAddModal}
                  >
                    Add Price Code
                  </button>
                  <Input.search
                    placeholder="Search Price Code"
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              }
            />

            {/* Table Section */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">SN.</th>
                    <th className="px-6 py-3">Price Code</th>
                    <th className="px-6 py-3">Action</th>
                    <th className="px-6 py-3">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {priceCodes.map((code, index) => (
                    <tr key={code._id} className="bg-white border-b">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{code.priceCode}</td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <CiEdit
                          onClick={() => handleEditClick(code.id)}
                          className="p-1 text-2xl rounded-md text-green-500 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200"
                        />
                        <MdDeleteForever
                          onClick={() => handleDeleteClick(code.id)}
                          className="p-1 text-2xl rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200"
                        />
                      </td>

                      <td className="px-6 py-4">
                        <a
                          href={`https://servicemenu.lakmesalon.in/${code.priceCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 text-xs w-[90px] block text-center"
                        >
                          View Link
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
                <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
                  <button
                    onClick={closeModal}
                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ×
                  </button>
                  <h2 className="text-lg font-semibold mb-4">
                    {editMode ? "Edit Price Code" : "Add Price Code"}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block mb-1 font-medium">
                        Price Code
                      </label>
                      <input
                        type="text"
                        name="priceCode"
                        value={formData.priceCode}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 font-semibold"
                    >
                      {loading
                        ? "Saving..."
                        : editMode
                        ? "Update Price Code"
                        : "Save Price Code"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export default PriceMapping;
