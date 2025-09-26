import React, { useEffect, useState } from "react";
import Layout, { Container } from "../components/layout";
import { DynamicLoader } from "../components/loader";
import BackHeader from "../components/backHeader";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { apiurl } from "../config/config";
import { useParams, useNavigate } from "react-router-dom";
import { FloatingInput } from "../components/floatingInput";
import { getCookie } from "../config/webStorage";

const EditBanner = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = getCookie("zrotoken");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    image: "",
    description: "",
    button1: "",
    url1: "",
    button2: "",
    url2: "",
    status: "active",
  });

  const [errors, setErrors] = useState({
    image: "",
    description: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "active" ? "inactive" : "active",
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "lakmesalon");
      data.append("cloud_name", "dv5del8nh");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dv5del8nh/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();
      if (result.secure_url) {
        setFormData((prev) => ({ ...prev, image: result.secure_url }));
      } else {
        toast.error("Upload failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    let newErrors = {};
    if (!formData.image) newErrors.image = "Please upload an image.";
    if (!formData.description)
      newErrors.description = "Please enter description.";
    if (!["active", "inactive"].includes(formData.status))
      newErrors.status = "Please select a valid status.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const payload = {
        image: formData.image,
        description: formData.description,
        button1: formData.button1,
        url1: formData.url1,
        button2: formData.button2,
        url2: formData.url2,
        status: formData.status,
      };

      const response = await axios.put(
        `${apiurl}/admin/banner/${id}`,
        payload,
        { headers: { Authorization: token } }
      );

      if (response.data.success === true) {
        toast.success("Banner updated successfully!");
        navigate("/banner");
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Failed to update banner!");
    } finally {
      setLoading(false);
    }
  };

  const handleGetBanner = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiurl}/admin/banner/${id}`, {
        headers: { Authorization: token },
      });
      const data = response?.data;
      if (data.success) {
        const { image, description, button1, url1, button2, url2, status } =
          data.data;
        setFormData({
          image: image || "",
          description: description || "",
          button1: button1 || "",
          url1: url1 || "",
          button2: button2 || "",
          url2: url2 || "",
          status: status || "active",
        });
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
      toast.error("Failed to fetch banner!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetBanner();
  }, []);

  return (
    <Layout>
      <Container>
        {loading && (
          <DynamicLoader maintext="Please wait" subtext="Processing Banner" />
        )}
        <ToastContainer />
        <div className="flex flex-wrap justify-between w-full h-full overflow-auto">
          <div className="flex flex-col py-2 px-2 w-full">
            <BackHeader title="Edit Banner" backButton={true} link="/banner" />
            <div className="p-6">
              <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md flex flex-col gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Upload Banner
                  </label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center">
                    {uploading ? (
                      <small className="text-blue-500">Uploading...</small>
                    ) : formData.image ? (
                      formData.image.endsWith(".mp4") ? (
                        <video
                          src={formData.image}
                          className="w-80 h-auto rounded mb-2"
                          autoPlay
                          muted
                          loop
                          controls
                        />
                      ) : (
                        <img
                          src={formData.image}
                          alt="Banner"
                          className="w-80 h-auto rounded mb-2"
                        />
                      )
                    ) : null}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="fileUpload"
                    />
                    <label
                      htmlFor="fileUpload"
                      className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                      Change File
                    </label>
                  </div>
                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium">Banner Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    placeholder="Enter banner description..."
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
                </div>

                <div className="w-full flex gap-4">
                  <div className="w-1/2">
                    <FloatingInput
                      label="Button 1"
                      type="text"
                      name="button1"
                      value={formData.button1}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/2">
                    <FloatingInput
                      label="Button 1 Link"
                      type="text"
                      name="url1"
                      value={formData.url1}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="w-full flex gap-4">
                  <div className="w-1/2">
                    <FloatingInput
                      label="Button 2"
                      type="text"
                      name="button2"
                      value={formData.button2}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/2">
                    <FloatingInput
                      label="Button 2 Link"
                      type="text"
                      name="url2"
                      value={formData.url2}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Status
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      onClick={toggleStatus}
                      className={`w-10 h-5 flex items-center rounded-full px-1 cursor-pointer transition-colors duration-300 ${
                        formData.status === "active"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                          formData.status === "active" ? "translate-x-4" : ""
                        }`}
                      ></div>
                    </div>
                    <span className="text-xs">{formData.status}</span>
                  </div>
                </div>

                <button
                  className="px-4 py-2 rounded-md font-semibold bg-orange-600 text-white float-right"
                  onClick={handleSubmit}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default EditBanner;
