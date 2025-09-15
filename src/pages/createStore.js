import React, { useEffect, useState } from "react";
import { DynamicLoader } from "../components/loader";
import Layout, { Container } from "../components/layout";
import BackHeader from "../components/backHeader";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiurl } from "../config/config";
import { useUser } from "../config/userProvider";
import { ToastContainer, toast } from "react-toastify";


const CreateStore = () => {
    const [loading, setLoading] = useState(false);
    const { token } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        storeName: "",
        region: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        const {storeName,region}=formData
        if(!storeName || !region)
        {
            return false
        }
        setLoading(true);
        try {
        const res = await axios.post(
            `${apiurl}/api/store/createStore`,
            formData,
            {
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
            }
        );
      
            setLoading(false);
            toast(res.data.message);
            navigate("/stores");
        
        } catch (error) {
        console.error(
            "Error fetching template:",
            error.response?.data || error.message
        );
        setLoading(false);
        // toast("Please Fill All Details");
        }
    };

  return (
    <Layout>
        <Container>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Create Store
        </h1>
       
          {/* Subject */}
          <div className="mb-4">
            <label
              htmlFor="subject"
              className="block text-gray-600 font-medium mb-2"
            >
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

          {/* Category */}
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-gray-600 font-medium mb-2"
            >
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


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#ea580c] text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition"
            onClick={handleSubmit}
          >
            Create Store
          </button>
        
      </div>
    </div>
    </Container>
    </Layout>
  );
};

export default CreateStore;
