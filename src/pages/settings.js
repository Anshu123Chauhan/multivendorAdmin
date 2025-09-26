import React, { useEffect, useState } from "react";
import Layout, { Container } from "../components/layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../config/webStorage";
import { apiurl, iamgeapiurl } from "../config/config";
import { DynamicLoader } from "../components/loader";
import BackHeader from "../components/backHeader";
import { FloatingInput } from "../components/floatingInput";

import { message, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";

const Settings = () => {
  const token = getCookie("zrotoken");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentid,setPaymentid]=useState("")

  const [formData, setFormData] = useState({
    apikey: "",
    secretkey: "",
    gatewayname:"",
    status:"active"
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
   
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (value) {
        delete newErrors[name];
      }

      return newErrors;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.gatewayname)
      newErrors.gatewayname = "Gateway name is required.";
    if (!formData.apikey) newErrors.apikey = "API KEY is required.";
    if (!formData.secretkey)
      newErrors.secretkey = "SECRET KEY is required.";
   
    return newErrors;
  };
  const fetchSettingData = async () => {
    try {
      const response = await axios.get(`${apiurl}/admin/paymentsetting`, {
        headers: {
          Authorization: token,
        },
      });
     
      if (response?.data?.success) {
        setFormData(response?.data?.data[0] || []);
        setPaymentid(response?.data?.data[0]._id)
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    } finally {
    }
  };
  useEffect(() => {
  
    fetchSettingData();
  }, []);


  const createCategory = async (e) => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSavingLoading(true);
      let res=""
      if(!paymentid){
       
        res = await axios.post(`${apiurl}/admin/paymentsetting`, formData, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
      }
      else{
         res = await axios.put(`${apiurl}/admin/paymentsetting/${paymentid}`, formData, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
      }

      if (res.data.success === true) {
        toast.success("Settings saved Successfully");
        navigate("/settings");
      } else if (res.data.status === 409) {
        toast.warn(res.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.warn(err.response.data.message);
      } else {
        console.error(`Error saving Settings: ${err.message}`);
        toast.error("Something went wrong");
      }
    } finally {
      setSavingLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <BackHeader backButton={true} link="/settings" title="Settings" />

        <div className="p-6 min-h-screen">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-center text-[#D4550B]">
              Save Razorpay Keys
            </h2>
            <div className="grid md:grid-cols-1 gap-6 mt-5">
              <FloatingInput
                label="Gateway Provide"
                type="text"
                name="gatewayname"
                value={formData.gatewayname}
                onChange={handleChange}
                error={errors.gatewayname}
                required={true}
              />
              <FloatingInput
                label="Api Key"
                type="text"
                name="apikey"
                value={formData.apikey}
                onChange={handleChange}
                error={errors.apikey}
                required={true}
              />

              <FloatingInput
                label="Secret Key"
                type="text"
                name="secretkey"
                value={formData.secretkey}
                onChange={handleChange}
                error={errors.secretkey}
                required={true}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status == "active"}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, status: "active" }))
                      }
                      className="text-[#D4550B] focus:ring-[#D4550B] border"
                    />
                    Active

                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status =="draft"}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, status: "draft" }))
                      }
                      className="text-[#D4550B] focus:ring-[#D4550B] border"
                    />
                  

                    Inactive
                  </label>
                </div>
              </div>
            

            </div>

            <div className="text-right">
              <Button
                className="bg-gray-800 hover:bg-zinc-950 hover:text-white mt-3 font-bold py-2 px-5 rounded"
                type="primary"
                loading={savingLoading}
                onClick={createCategory}
                icon={savingLoading ? <LoadingOutlined /> : null}
              >
                {savingLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
