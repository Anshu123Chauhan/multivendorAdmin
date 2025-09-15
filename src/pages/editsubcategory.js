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

const EditSubcategory = () => {
  const token = getCookie("zrotoken");
  const navigate = useNavigate();
  const { subcategoryId } = useParams();

  const [loading, setLoading] = useState(true);
  const [savingLoading, setSavingLoading] = useState(false);
  const [uploading, setUploading] = useState({
    womenimage: false,
    menimage: false,
  });


  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    description: "",
    menImage: "",
    womenImage: "",
    status: true,
  });

  const [categorydata, setCategoryData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = async (e, field) => {
    
    if (!e.target.files || e.target.files.length === 0) {
      toast.error("Please select a file.");
      return;
    }
  

    try {
      setUploading((prev) => ({ ...prev, [field]: true }));
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed.");
        setUploading((prev) => ({ ...prev, [field]: false }));
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      setUploading((prev) => ({ ...prev, [field]: true }));
      const response = await axios.post(`${apiurl}/admin/upload-image`, formData);
      const  secure_url  = response.data.url;

      setFormData((prev) => ({ ...prev, [field]: secure_url }));
      console.log(secure_url)
      
    } catch (err) {
      console.error('Upload failed:', err);
      
    } finally {
          setUploading((prev) => ({ ...prev, [field]: false }));
        }
  };

  const isFormValid =  formData.name !== "" &&
  formData.description !== "" &&
  formData.womenImage !== "" &&
  formData.menImage !== "";

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(`${apiurl}/admin/category/getCategories`, {
        headers: { Authorization: token, "ngrok-skip-browser-warning": "69420" },
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
        `${apiurl}/admin/subcategory/getsubCategoryById/${subcategoryId}`,
        {
          headers: { Authorization: token, "ngrok-skip-browser-warning": "69420" },

        }
      );
      setFormData(response.data.data);
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
        `${apiurl}/admin/subcategory/updateSubCategory/${subcategoryId}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420"
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
      <Container>
        {loading ? (
          <DynamicLoader maintext="Wait" subtext="Fetching Subcategory Details" />
        ) : (
          <div className="h-full w-full px-5 py-3 overflow-scroll">
            <BackHeader backButton={true} link="/subcategory" title="Edit Subcategory" />

            <div className="p-6 min-h-screen">
              <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Choose Category
                      </label>
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Category</option>
                        {categorydata.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter category name..."
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Description</label>
                      <textarea
                        rows="2"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>
                  </div>

                  <div className="w-full lg:w-1/3 space-y-6">
                    {["womenImage", "menImage"].map((fieldKey) => (
                      <div key={fieldKey}>
                        <label className="block text-gray-700 font-medium mb-2 capitalize">
                          { fieldKey === "womenImage"
                            ? "Women Image"
                            : "Men Image"}
                        </label>
                        <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                          {uploading[fieldKey] ? (
                            <small className="text-blue-500">
                              Uploading...
                            </small>
                          ) : formData[fieldKey] ? (
                            <img
                              src={formData[fieldKey]}
                              alt="Uploaded"
                              className="w-48 object-cover rounded"
                            />
                          ) : null}

                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, fieldKey)}
                            className="hidden"
                            id={`fileUpload-${fieldKey}`}
                          />
                          <label
                            htmlFor={`fileUpload-${fieldKey}`}
                            className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer mt-2"
                          >
                            Add{" "}
                            { fieldKey === "womenImage"
                              ? "Women"
                              : "Men"}{" "}
                            Image
                          </label>
                          <span className="text-gray-500 text-sm mt-1">
                            or drag and drop to upload
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                <div className="text-right">
                  <Button
                    className="bg-gray-800 hover:bg-zinc-950 text-white font-bold py-2 px-5 rounded mt-3"
                    type="primary"
                    loading={savingLoading}
                    onClick={updateSubCategory}
                    disabled={!isFormValid}
                  >
                    {savingLoading ? "Saving..." : "Update"}
                  </Button>
                </div>
              </div>
            </div>


          </div>
        )}
      </Container>
    </Layout>
  );
};

export default EditSubcategory;
