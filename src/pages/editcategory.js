import React, { useEffect, useState } from "react";
import Layout, { Container } from "../components/layout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../config/webStorage";
import { apiurl } from "../config/config";
import { DynamicLoader } from "../components/loader";
import BackHeader from "../components/backHeader";
import { FloatingInput } from "../components/floatingInput";
import { message, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";

const Editcategory = () => {
  const token = getCookie("zrotoken");
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [loading, setLoading] = useState(true);
  const [savingLoading, setSavingLoading] = useState(false);
   const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    status: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${apiurl}/admin/category/${categoryId}`, {
          headers: { Authorization: token},
        });
        if (res.status === 200) {
          setFormData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Failed to fetch category details");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) fetchCategory();
  }, [categoryId, token]);

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
      "meta":formData.name,
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
    if (!formData.name) newErrors.name = "Category Name is required.";
    if (!formData.description)
      newErrors.description = "Description is required.";
     if (!formData.image)
      newErrors.image = "Category Image is required.";
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


  const updateCategory = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    try {
      setSavingLoading(true);
      const res = await axios.put(
        `${apiurl}/admin/category/${categoryId}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      toast(res.data.message)
      // if (res.status === 200) {
        //toast.success("Category Updated Successfully");
        navigate("/category");
      //}
    } catch (err) {
      console.error(`Error updating category: ${err.message}`);
      toast.error("Failed to update category");
    } finally {
      setSavingLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <BackHeader backButton={true} link="/category" title="Category" />

        <div className="p-6 min-h-screen">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-center text-[#D4550B]">
              Update Category
            </h2>
            <div className="grid md:grid-cols-1 gap-6 mt-5">
              <FloatingInput
                label="Category Name"
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
                onClick={updateCategory}
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

export default Editcategory;