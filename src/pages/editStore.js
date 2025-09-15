import React, { useEffect, useState } from "react";
import { DynamicLoader } from "../components/loader";
import Layout, { Container } from "../components/layout";
import BackHeader from "../components/backHeader";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiurl } from "../config/config";
import { useUser } from "../config/userProvider";
import { ToastContainer, toast } from "react-toastify";

const EditStore = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useUser();
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [formData, setFormData] = useState({
    storeName: "",
    region: "",
    // status: "",
  });

  // Fetch store data
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiurl}/api/store/getStoreById/${storeId}`, {
          headers: { Authorization: token },
        });
        if (res.data.success) {
          setFormData({
            storeName: res.data.data.storeName || "",
            region: res.data.data.region || "",
            //status: res.data.data.status || "",
          });
        }
      } catch (error) {
        toast.error("Error fetching store details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId, token]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { storeName, region } = formData;

    if (!storeName || !region) {
      return toast.error("Store Name and Region are required.");
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${apiurl}/api/store/editStore/${storeId}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
     // console.log(res.data)
        setLoading(false);
        toast(res.data.message);
        navigate("/stores");
      
    } catch (error) {
      toast.error("Failed to update store.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container>
      <BackHeader
          backButton={true}
          link="/stores"
          title={`Store Details of ${formData.storeName}`}
          rightSide={
            <div className="flex justify-between">
              <span
                className={`font-semibold ${
                  formData?.data?.status === "ACTIVE"
                    ? "text-green-600" // Green for ACTIVE
                    : "text-red-600" // Red for INACTIVE
                }`}
              >
                {formData?.data?.status}
              </span>
            </div>
          }
        />
        {loading && <DynamicLoader maintext="Loading" subtext="Please wait..." />}
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Edit Store</h1>

            <form onSubmit={handleSubmit}>
              {/* Store Name */}
              <div className="mb-4">
                <label htmlFor="storeName" className="block text-gray-600 font-medium mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Enter the store name"
                  required
                />
              </div>

              {/* Store Region */}
              <div className="mb-4">
                <label htmlFor="region" className="block text-gray-600 font-medium mb-2">
                  Store Region
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                >
                  <option value="">Select a region</option>
                  <option value="northern">Northern</option>
                  <option value="eastern">Eastern</option>
                  <option value="western">Western</option>
                  <option value="southern">Southern</option>
                  <option value="central">Central</option>
                  <option value="northeastern">Northeastern</option>
                </select>
              </div>

              {/* Store Status */}
              {/* <div className="mb-4">
                <label htmlFor="status" className="block text-gray-600 font-medium mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#ea580c] text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                Update Store
              </button>
            </form>
          </div>
        </div>
      </Container>
      
    </Layout>
  );
};

export default EditStore;
