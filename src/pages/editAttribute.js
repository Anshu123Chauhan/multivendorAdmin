import React, { useEffect, useState } from "react";
import Layout, { Container } from "../components/layout";
import { useNavigate,useParams } from "react-router-dom";
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

const EditAttribute= () => {
  const { id } = useParams();
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
  const fetchAttributeData = async () => {
    try {
      const response = await axios.get(`${apiurl}/admin/attribute/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(response?.data?.data);
      if (response?.data?.success) {
        const attributeValues = response?.data?.data?.values || [];

        setFormData({
          ...response?.data?.data,
          values: attributeValues.map(v => v.value).join(", "),
          originalValues: attributeValues     
        });
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    } finally {
    }
  };
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

const createAttribute = async () => {
  const validationErrors = validate();
  if (Object.keys(validationErrors).length) {
    setErrors(validationErrors);
    return;
  }

  // Step 1: Clean input values
  const inputValues = formData.values
    .split(",")
    .map(v => v.trim())
    .filter(v => v.length);

  // Step 2: Prepare payload for updating existing/new values
  const payload = {
    ...formData,
    values: inputValues.map(val => {
      const existing = formData.originalValues?.find(
        obj => obj.value.toLowerCase() === val.toLowerCase()
      );

      return existing
        ? { ...existing, value: val } // keep its _id
        : { value: val, isDeleted: false }; // new entry
    })
  };

  try {
    setSavingLoading(true);

    // Step 3: Detect deleted values
    const deletedValues = formData.originalValues?.filter(
      obj => !inputValues.some(val => val.toLowerCase() === obj.value.toLowerCase())
    ) || [];

    // Step 4: Call delete API for removed ones
    // for (const del of deletedValues) {
    //   await axios.put(`${apiurl}/admin/attribute/${id}/value/${del._id}`, {
    //     ...del,
    //     isDeleted: true
    //   }, {
    //     headers: {
    //       Authorization: token,
    //       "Content-Type": "application/json",
    //     },
    //   });
    // }

    // Step 5: Update attribute with new/updated values
    const res = await axios.put(`${apiurl}/admin/attribute/${id}`, payload, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200 || res.status === 201) {
      toast.success("Attribute Updated Successfully");
      navigate("/attribute");
    } else if (res.data.status === 409) {
      toast.warn(res.data.message);
    }
  } catch (err) {
    if (err.response && err.response.status === 409) {
      toast.warn(err.response.data.message);
    } else {
      console.error(`Error updating attribute: ${err.message}`);
      toast.error("Something went wrong");
    }
  } finally {
    setSavingLoading(false);
  }
};


  useEffect(() => {
    fetchAttributeData();
  }, [id]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <BackHeader backButton={true} link="/attribute" title="Attribute" />

        <div className="p-6 min-h-screen">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-center text-[#D4550B]">
              Edit Attribute
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
                {savingLoading ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditAttribute;
