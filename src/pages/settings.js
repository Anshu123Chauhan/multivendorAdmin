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

  const [formData, setFormData] = useState({
    api_key: "",
    secret_key: "",
  });

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
   
    setFormData((prev) => ({
      ...prev,
      meta: formData.name,
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
    if (!formData.api_key) newErrors.api_key = "API KEY is required.";
    if (!formData.secret_key)
      newErrors.secret_key = "SECRET KEY is required.";
   
    return newErrors;
  };



  const createCategory = async (e) => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSavingLoading(true);
      const res = await axios.post(`${apiurl}/admin/settings`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

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
              Add Razorpay Keys
            </h2>
            <div className="grid md:grid-cols-1 gap-6 mt-5">
              <FloatingInput
                label="Api Key"
                type="text"
                name="name"
                value={formData.api_key}
                onChange={handleChange}
                error={errors.api_key}
                required={true}
              />

              <FloatingInput
                label="Secret Key"
                type="text"
                name="secret_key"
                value={formData.secret_key}
                onChange={handleChange}
                error={errors.secret_key}
                required={true}
              />
            

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
