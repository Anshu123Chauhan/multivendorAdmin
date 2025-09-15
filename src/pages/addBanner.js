import React, { useState } from "react";
import Layout, { Container } from "../components/layout"
import { DynamicLoader } from "../components/loader";
import BackHeader from "../components/backHeader";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { apiurl } from "../config/config"
import { useNavigate } from "react-router-dom";

const AddBanner = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        image: "",
        tags: [],
        status: "active",
        tagInput: "",
    });

    const [errors, setErrors] = useState({
        image: "",
        tags: "",
        status: ""
    });

    const toggleStatus = () => {
        setFormData((prev) => ({
            ...prev,
            status: prev.status === "active" ? "inactive" : "active",
        }));
    };

    const handleImageUpload = async (e) => {
    
        if (!e.target.files || e.target.files.length === 0) {
          toast.error("Please select a file.");
          return;
      }
      try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file.type.startsWith("image/")) {
              toast.error("Only image files are allowed.");
              setUploading(false);
              return;
            }
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post(`${apiurl}/admin/upload-image`, formData);
            const  secure_url  = response.data.url;
      
            setFormData((prev) => ({ ...prev, image: secure_url }));
            console.log(secure_url)
            
          } catch (err) {
            console.error('Upload failed:', err);
            
          } finally {
                setUploading(false);
              }
        };

    const handleUpload = async () => {
        let newErrors = { image: "", tags: "", status: "" };
        let hasError = false;

        if (!formData.image) {
            newErrors.image = "Please upload an image.";
            hasError = true;
        }

        if (formData.tags.length === 0) {
            newErrors.tags = "Please add at least one tag.";
            hasError = true;
        }

        if (!formData.status || !["active", "inactive"].includes(formData.status)) {
            newErrors.status = "Please select a valid status.";
            hasError = true;
        }

        setErrors(newErrors);

        if (hasError) return;

        setLoading(true);

        try {
            const payload = {
                image: formData.image,
                status: formData.status,
                tag: formData.tags
            }
            const response = await axios.post(`${apiurl}/admin/banner/create`, payload);

            const data = await response.data;

            if (data.success) {
                toast.success("Banner uploaded successfully!");

                setFormData({
                    image: "",
                    tags: [],
                    status: "active",
                    tagInput: "",
                })

                navigate("/banner");
            }
        }
        catch (error) {
            console.log("Error", error);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <Container>
                {loading == true ? (
                    <DynamicLoader maintext="wait" subtext="Fetching Banner Data" />
                ) : null}
                <div className="flex flex-wrap justify-between w-full h-full  overflow-auto">
                    <ToastContainer />
                    <div className="flex flex-col  py-2 px-2 w-full">
                        <BackHeader
                            title="Add Banner"
                            backButton={true}
                            link="/banner"
                        />
                        <div className="p-6">
                            <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
                                <div className="flex flex-col gap-6">
                                    {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
                                    <div className="flex gap-6">
                                        <div className="flex-1">
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Upload Banner
                                            </label>
                                            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center">
                                                {uploading ? (
                                                    <small className="text-blue-500">Uploading...</small>
                                                ) : formData?.image ? (
                                                    <img src={formData?.image} alt="Uploaded" className="w-48 object-cover rounded mb-2" />
                                                ) : ""}

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    id="fileUpload"
                                                />
                                                <label
                                                    htmlFor="fileUpload"
                                                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer"
                                                >
                                                    Add banner
                                                </label>
                                                <span className="text-gray-500 text-sm mt-2">or drag and drop to upload</span>

                                            </div>
                                            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                                        </div>
                                    </div>
                                    {/* <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Enter Tags
                                        </label>

                                        <input
                                            type="text"
                                            value={formData.tagInput}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, tagInput: e.target.value }))
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === ",") {
                                                    e.preventDefault();
                                                    const trimmed = formData.tagInput.trim();
                                                    if (trimmed && !formData.tags.includes(trimmed)) {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            tags: [...prev.tags, trimmed],
                                                            tagInput: "",
                                                        }));
                                                    } else {
                                                        setFormData((prev) => ({ ...prev, tagInput: "" }));
                                                    }
                                                }
                                            }}
                                            placeholder="Enter tag and press Enter or comma"
                                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />


                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.tags.map((tag, index) => (
                                                <span key={index} className="bg-gray-200 text-sm px-2 py-1 rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                                    </div> */}

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Tags</label>
                                        <div
                                            className="flex flex-wrap items-center gap-2 p-2 border rounded focus-within:ring-2 focus-within:ring-blue-500"
                                        >
                                            {formData.tags.map((tag, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-200 text-sm px-2 py-1 rounded flex items-center gap-1"
                                                >
                                                    {tag}
                                                    <button
                                                        onClick={() =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                tags: prev.tags.filter((_, i) => i !== index),
                                                            }))
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                            <input
                                                id="tagInput"
                                                type="text"
                                                value={formData.tagInput}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, tagInput: e.target.value }))
                                                }
                                                onKeyDown={(e) => {
                                                    const trimmed = formData?.tagInput?.trim();

                                                    if ((e.key === "Enter" || e.key === ",") && trimmed) {
                                                        e.preventDefault();
                                                        if (!formData.tags.includes(trimmed)) {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                tags: [...prev.tags, trimmed],
                                                                tagInput: "",
                                                            }));
                                                        } else {
                                                            setFormData((prev) => ({ ...prev, tagInput: "" }));
                                                        }
                                                    }

                                                    else if (e.key === "Backspace" && !formData.tagInput) {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            tags: prev.tags.slice(0, -1),
                                                        }));
                                                    }
                                                }}
                                                placeholder="Enter tags by comma seperated or press enter."
                                                className="flex-1 min-w-[120px] px-2 py-1 outline-none"
                                            />
                                        </div>
                                        {errors.tags && (
                                            <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
                                        )}
                                    </div>


                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Status
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <div
                                                onClick={toggleStatus}
                                                className={`w-10 h-5 flex items-center rounded-full px-1 cursor-pointer transition-colors duration-300 ${formData.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}
                                            >
                                                <div
                                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.status === 'active' ? 'translate-x-4' : ''
                                                        }`}
                                                ></div>
                                            </div>
                                            <span className="text-xs">{formData?.status}</span>
                                        </div>
                                        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                                    </div>
                                    {/* </div> */}
                                    <div>
                                        <button className="px-4 py-2 rounded-md font-semibold bg-orange-600 text-white float-right"
                                            onClick={handleUpload}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Layout>
    );
}

export default AddBanner;