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

const AddAttribute= () => {
  const token = getCookie("zrotoken");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    values:[],
    meta: "",
    isActive: true,
  });
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Attribute Name is required.";
        break;
      case "values":
        if (!value.trim()) error = "Attribute Values are required.";
        break;
     
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return newErrors;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const createAttribute = async (e) => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
  const payload = {
  ...formData,
  values: typeof formData.values === "string"
    ? formData.values
        .split(",")                  // split by comma
        .map((v) => v.trim())        // remove spaces
        .filter((v) => v.length)     // remove empty
        .map((v) => ({
          value: v,
          isDeleted: false
        }))                          // convert to object
    : formData.values.map((v) => (
        typeof v === "string"
          ? { value: v.trim(), isDeleted: false }
          : v
      )),
};



    try {
      setSavingLoading(true);
      const res = await axios.post(`${apiurl}/admin/attribute`, payload, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Attribute Created Successfully");
        navigate("/attribute");
      } else if (res.data.status === 409) {
        toast.warn(res.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.warn(err.response.data.message);
      } else {
        console.error(`Error creating attribute: ${err.message}`);
        toast.error("Something went wrong");
      }
    } finally {
      setSavingLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <BackHeader backButton={true} link="/attribute" title="Attribute" />

        <div className="p-6 min-h-screen">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-center text-[#D4550B]">
              Create New Attribute
            </h2>
            <div className="grid md:grid-cols-1 gap-6 mt-5">
              <FloatingInput
                label="Attribute Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required={true}
              />

              <FloatingInput
                label="Attribute Values"
                type="text"
                name="values"
                value={formData.values}
                onChange={handleChange}
                error={errors.values}
                required={true}
              />
             
            </div>

            <div className="text-right">
              <Button
                className="bg-gray-800 hover:bg-zinc-950 hover:text-white mt-3 font-bold py-2 px-5 rounded"
                type="primary"
                loading={savingLoading}
                onClick={createAttribute}
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

export default AddAttribute;
