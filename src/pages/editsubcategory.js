import React, { useEffect, useState } from "react";
import Layout, { Container } from "../components/layout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../config/webStorage";
import { apiurl } from "../config/config";
import { DynamicLoader } from "../components/loader";
import BackHeader from "../components/backHeader";
import { message, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import { FloatingInput } from "../components/floatingInput";
const EditSubcategory = () => {
  const token = getCookie("zrotoken");
  const navigate = useNavigate();
  const { subcategoryId } = useParams();

  const [loading, setLoading] = useState(true);
  const [savingLoading, setSavingLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    name: "",
    description: "",
    image: "",
    status: true,
    meta:""
  });
  const [errors, setErrors] = useState({});

  const [categorydata, setCategoryData] = useState([]);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      const uploadedUrl = await handleFileUpload(files[0]);
      if (uploadedUrl) {
        setFormData((prev) => ({
          ...prev,
          [name]: uploadedUrl,
        }));

        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[name];
          return newErrors;
        });
      }
      return;
    }
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
    if (!formData.name) newErrors.name = "Sub Category Name is required.";
    if (!formData.name) newErrors.name = "Category Selection is required.";
    if (!formData.description)
      newErrors.description = "Description is required.";
    if (!formData.image) newErrors.image = "Category Image is required.";
    return newErrors;
  };

  const handleFileUpload = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "lakmesalon");
    data.append("cloud_name", "dv5del8nh");

    try {
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dv5del8nh/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      let result = await res.json();
      return result.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };
 

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(`${apiurl}/admin/category`, {
        headers: { Authorization: token,},
      });
      if (response?.data?.data?.length > 0) {
        setCategoryData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/admin/category/sub/${subcategoryId}`,
        {
          headers: { Authorization: token},

        }
      );
       const data = response.data.data;

    if (!data.isDeleted) {
      setFormData({
        ...data,
        category: data.category?._id || "",
      });
    } else {
      toast.warn("This subcategory is deleted and cannot be selected");
      setFormData({}); // or keep previous state
    }
    } catch (error) {
      toast.error("Error fetching subcategory");
    } finally {
      setLoading(false);
    }
  };

  const updateSubCategory = async () => {
    try {
      setSavingLoading(true);
      const response = await axios.put(
        `${apiurl}/admin/category/sub/${subcategoryId}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Subcategory updated successfully");
        navigate("/subcategory");
      }
    } catch (error) {
      toast.error("Error updating subcategory");
    } finally {
      setSavingLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryList();
    fetchSubCategory();
  }, [subcategoryId]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <BackHeader
          backButton={true}
          link="/subcategory"
          title="Sub Category"
        />

        <div className="p-6 min-h-screen">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-center text-[#D4550B]">
             Edit Sub Category
            </h2>
            <div className="grid md:grid-cols-1 gap-6 mt-5">
              <FloatingInput
                label="Select Category"
                type="select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                error={errors.category}
                required={true}
                options={[
                  { value: "", label: "" },
                  ...categorydata.map((item) => ({
                    value: item._id,
                    label: item.name,
                  })),
                ]}
              />
              <FloatingInput
                label="Sub Category Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required={true}
              />

              <FloatingInput
                label="Description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                required={true}
              />
                <FloatingInput
              label="Upload Image"
              type="file"
              name="image"
              onChange={handleChange}
              error={errors.image}
              required={true}
            />

            {uploading ? (
              <small className="text-blue-500">Uploading...</small>
            ) : formData.image ? (
              <img
                src={formData.image}
                alt="Uploaded"
                className="w-48 object-cover rounded mt-2"
              />
            ) : null}
            </div>
          

            <div className="text-right">
              <Button
                className="bg-gray-800 hover:bg-zinc-950 hover:text-white mt-3 font-bold py-2 px-5 rounded"
                type="primary"
                loading={savingLoading}
                onClick={updateSubCategory}
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

export default EditSubcategory;
