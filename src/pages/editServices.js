import React, { useEffect, useState } from "react";
import Layout, { Container } from "../components/layout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../config/webStorage";
import { apiurl } from "../config/config";
import { DynamicLoader } from "../components/loader";
import BackHeader from "../components/backHeader";

import { Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import VideoPlayer from "../components/videoPlayer";

const EditServices = () => {
  const { serviceId } = useParams();
  const token = getCookie("zrotoken");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uspList, setUspList] = useState([]);
  const [uspListt, setUspListt] = useState([]);
  const [servicePrice, setServicePrice] = useState([]);
  const [editedPrices, setEditedPrices] = useState([]);
  const [uploadingDefaultImage, setUploadingDefaultImage] = useState(false);
  const [uploadingAdditionalImage, setUploadingAdditionalImage] =
    useState(false);
  const [uploadingDefaultVideo, setUploadingDefaultVideo] = useState(false);
  const [uploadingAdditionalVideo, setUploadingAdditionalVideo] =
    useState(false);
  const [priceList, setPriceList] = useState([]);

  // Single state object for all form data
  const [formData, setFormData] = useState({
    categoryId: "",
    serviceName: "",
    serviceCode: "",
    description: "",
    images: [],
    status: true,
    storePrices: [],
    duration: "",
    gender: "",
    videos: [],
    usp: [],
    servicePlans: [],
    subCategoryId: "",
    tags: "",
    recommended: 1,
    id: "",
    additionalInfo:"",
    mainService:"",
    variants:"",
    concern:"",

  });

  const [categorydata, setCategoryData] = useState([]);
  const [subcategorydata, setSubcategoryData] = useState([]);
  const [savingLoading, setSavingLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "storePrices" ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e, isDefaultVal) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error("Please select a file.");
      return;
    }
    const setLoading =
      isDefaultVal === 1
        ? setUploadingDefaultImage
        : setUploadingAdditionalImage;

    try {
      setLoading(true);
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed.");
        setLoading(false);
        return;
      }

      const formDataCloud = new FormData();
      formDataCloud.append("file", file);
      const response = await axios.post(
        `${apiurl}/admin/upload-image`,
        formDataCloud
      );
      // const  secure_url  = response.data.url;

      const { url, original_filename } = response.data;
      toast.success("Image uploaded successfully!");
      setFormData((prev) => {
        let updatedImages = [...prev.images];

        if (isDefaultVal === 1) {
          updatedImages = updatedImages.filter((img) => img.isDefault !== 1);
        }

        return {
          ...prev,
          images: [
            ...updatedImages,
            {
              name: original_filename,
              url: url,
              isDefault: isDefaultVal,
            },
          ],
        };
      });
    } catch (error) {
      console.error(
        "Image upload error:",
        error.response?.data || error.message
      );
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const [uspInput, setUspInput] = useState("");

  const handleAddUsp = () => {
    if (uspInput.trim()) {
      setUspListt([...uspListt, uspInput.trim()]);
      setUspInput("");
    }
  };

  const handleRemoveUsp = (index) => {
    const updatedList = [...uspListt];
    updatedList.splice(index, 1);
    setUspListt(updatedList);
  };

  // Validate form

  const isFormValid =
    String(formData?.serviceName || "").trim() &&
    String(formData?.serviceCode || "").trim() &&
    String(formData?.categoryId || "").trim() &&
    String(formData?.subCategoryId || "").trim() &&
    String(formData?.description || "").trim() &&
    String(formData?.images || "").trim() &&
    formData?.storePrices?.length > 0;

  //fetch store list

  //fetch category list
  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/admin/category/getCategories`,
        {
          headers: {
            Authorization: token,
            // "ngrok-skip-browser-warning": "69420"
          },
        }
      );

      if (response?.data?.data?.length > 0) {
        setCategoryData(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    } finally {
    }
  };

  const fetchSubCategoryList = async (categoryId) => {
    try {
      const response = await axios.get(
        `${apiurl}/admin/subcategory/getsubCategories`,
        {
          headers: {
            Authorization: token,
            // "ngrok-skip-browser-warning": "69420"
          },
        }
      );

      if (response?.data?.data?.length > 0) {
        const filtered = response?.data?.data.filter(
          (sub) => sub.categoryId == categoryId
        );

        setSubcategoryData(filtered || []);
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (formData.categoryId) {
      fetchSubCategoryList(formData.categoryId);
    }
  }, [formData.categoryId]);

  const transformPriceData = (data) => {
    const grouped = {};

    data.forEach((item) => {
      const { priceCode, gender, price, priceCodeId, storeId } = item;

      if (!grouped[priceCode]) {
        grouped[priceCode] = {
          priceCode,
          priceCodeId,
          storeId,
          male: null,
          female: null,
        };
      }

      if (gender === "MALE") {
        grouped[priceCode].male = price;
      } else if (gender === "FEMALE") {
        grouped[priceCode].female = price;
      }
    });

    return Object.values(grouped);
  };

  const fetchGetAllPrice = async () => {
    try {
      const response = await axios.get(`${apiurl}/admin/pricecode/getAll`);
      const data = await response.data;

      if (data?.success) {
        setPriceList(data?.data);
      }
    } catch (error) {
      console.log("Error", error.message);
    }
  };

  const fetchPricecodeList = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/admin/store/storeListing/${serviceId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await response.data;

      if (data.success) {
        const grouped = transformPriceData(data?.data || []);

        setServicePrice(grouped);
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchGetAllPrice();
    fetchPricecodeList();
    fetchCategoryList();
    fetchSubCategoryList();
    fetchServices();
  }, []);

  const handleVideoUpload = async (e, isDefaultValue) => {
    const isDefault = isDefaultValue === 1;
    const setLoading = isDefault
      ? setUploadingDefaultVideo
      : setUploadingAdditionalVideo;

    const input = e.target; // reference the input
    const file = input.files[0]
    try {
      setLoading(true);
      // const file = e.target.files[0];

      if (file.size > 40 * 1024 * 1024) {
        // toast.error("Video is too large! Max 40MB.");
        alert("Video is too large! Max 40MB.")
        input.value = "";
        return;
      }

      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch(`${apiurl}/admin/service/upload-video`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 413) {
        toast.error("Video is too large. Please upload a smaller file.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      const { url } = data;
      const original_filename = file.name;

      if (url) {
        setFormData((prev) => {
          let updatedVideos;

          if (isDefault) {
            updatedVideos = [
              ...prev.videos.filter((v) => v.isDefault !== 1),
              {
                url: url.publicURL,
                name: original_filename,
                language: "English",
                isDefault: 1,
              },
            ];
          } else {
            updatedVideos = [
              ...prev.videos,
              {
                url: url.publicURL,
                name: original_filename,
                language: "Other",
                isDefault: 0,
              },
            ];
          }
          return {
            ...prev,
            videos: updatedVideos,
          };
        });
        toast.success("Video uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Failed to upload video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    // console.log("servicesssss", serviceId);
    try {
      const response = await axios.get(
        `${apiurl}/admin/service/getServiceById/${serviceId}`,
        {
          headers: {
            Authorization: token,
            // "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      const serviceData = response.data.data;
      setFormData(serviceData);
      const uspArray = serviceData.usp
        ? serviceData.usp.split(",").map((item) => item.trim())
        : [];

      setUspListt(uspArray);

      if (serviceData.servicePlans.length > 0) {
        // Update uspList with storePrices
        setUspList(
          serviceData.servicePlans.map((item) => ({
            pincode: item.priceCode,
            price: item.price || "N/A", // Handle null values
          }))
        );
      }
    } catch (error) {
      // toast.error("Error fetching subcategory");
    } finally {
      setLoading(false);
    }
  };

  const updateService = async () => {
    setSavingLoading(true);
   if (
    !formData.serviceName ||
    !formData.serviceCode ||
    !formData.categoryId ||
    !formData.subCategoryId ||
    !formData.duration
  ) {
    toast.error("Please fill in all mandatory fields");
    setSavingLoading(false);
    return; 
  }

    try {
      const response = await axios.put(
        `${apiurl}/admin/service/updateService/${serviceId}`, 
        {
          serviceName: formData.serviceName,
          serviceCode: formData.serviceCode,
          categoryId: formData.categoryId,
          subCategoryId: formData.subCategoryId,
          description: formData.description,
          images: formData.images,
          videos: formData.videos,
          duration: formData.duration,
          status: formData.status,
          usp: uspListt.join(","),
          tags: formData.tags,
          additionalInfo: formData.additionalInfo,
          mainService: formData.mainService,
          variants: formData.variants,
          concern: formData.concern,
          recommended: formData.recommended == 0 ? "no" : "yes",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      console.log("update service ---------->", response)
      console.log("update service ---------->", response?.data?.statusCode)

      if (response?.data?.statusCode === 200) {
        toast("Service updated successfully");
      }
    } catch (error) {
      console.error("Error updating service:", error);  
      toast.error(error.response.data.message);
    } finally {
      setSavingLoading(false);
    }
  };

  const handleAddPrice = async (priceCodeId) => {
    try {
      const index = priceList.findIndex((item) => item.id === priceCodeId);

      const myData = {
        priceCodeId: priceCodeId,
        malePrice: editedPrices?.[index]?.male,
        femalePrice: editedPrices?.[index]?.female,
        serviceId: serviceId,
      };

      const response = await axios.post(
        `${apiurl}/admin/store/createStore`,
        myData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response?.data?.success === true) {
        toast.success("Price added successfully");
        fetchPricecodeList();
      }
    } catch (error) {
      console.error("Error fetching pricecode: ", error);
    }
  };

  const handleImgDelete = (imgToDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((img) => img !== imgToDelete),
    }));
  };

  const handleVideoDelete = (vdoToDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      videos: prevData.videos.filter((vdo) => vdo !== vdoToDelete),
    }));
  };

  // Group prices by priceCodeId with male and female
  const mergedList = priceList.map((priceItem) => {
    const matchedPrices = servicePrice.filter(
      (p) => p.priceCodeId === priceItem.priceCodeId
    );

    const malePrice =
      matchedPrices.find((p) => p.gender === "MALE")?.price ?? "";
    const femalePrice =
      matchedPrices.find((p) => p.gender === "FEMALE")?.price ?? "";

    return {
      priceCodeId: priceItem.priceCodeId,
      priceCode: priceItem.priceCode,
      male: malePrice,
      female: femalePrice,
    };
  });

  return (
    <Layout>
      <Container>
        {loading ? (
          <DynamicLoader
            maintext="Wait"
            subtext="Fetching Collection Details"
          />
        ) : (
          <div className="h-full w-full px-5 py-3 overflow-scroll">
            <BackHeader backButton={true} link="/service" title="Service" />

            <div className="min-h-screen">
              <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md">
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Choose Category<span className="text-red-600 ml-1">*</span>
                      </label>
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        // onChange={handleChange}
                        onChange={(e) => {
                          handleChange(e);
                          fetchSubCategoryList(e.target.value);
                        }}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Category</option>
                        {categorydata.map((item) => (
                          <option
                            value={item.id}
                            key={item.id}
                            selected={formData.categoryId === item.id}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Choose Sub Category<span className="text-red-600 ml-1">*</span>
                      </label>
                      <select
                        name="subCategoryId"
                        value={formData.subCategoryId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Sub Category</option>
                        {subcategorydata.map((item) => {
                          const selectedSubCategory =
                            formData.subCategoryId === item.id;

                          return (
                            <option
                              value={item.id}
                              key={item.id}
                              selected={selectedSubCategory ? item.name : ""}
                            >
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Service Name<span className="text-red-600 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="serviceName"
                        value={formData.serviceName}
                        onChange={handleChange}
                        placeholder="Enter service name..."
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Service Code<span className="text-red-600 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="serviceCode"
                        value={formData.serviceCode}
                        onChange={handleChange}
                        placeholder="Enter service name..."
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Duration (in mins)<span className="text-red-600 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          placeholder="Enter duration..."
                          min="1"
                          className="w-full px-3 py-2 pr-14 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                          mins
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Tags (Add Comma Seprated)
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="Enter tags..."
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Main Service
                      </label>
                      <input
                        type="text"
                        name="mainService"
                        value={formData.mainService}
                        onChange={handleChange}
                        placeholder="Enter main service name..."
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                      Variants
                      </label>
                      <input
                        type="text"
                        name="variants"
                        value={formData.variants}
                        onChange={handleChange}
                        placeholder="Enter variants name..."
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                      Concern  (Add Comma Seprated)
                      </label>
                      <input
                        type="text"
                        name="concern"
                        value={formData.concern}
                        onChange={handleChange}
                        placeholder="Enter concern..."
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Recommended
                      </label>

                      <div className="flex items-center space-x-6">
                        <label className="inline-flex items-center text-gray-600">
                          <input
                            type="radio"
                            name="recommended"
                            value={1}
                            checked={formData.recommended == 1}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 border border-black"
                          />

                          <span className="ml-2">Yes</span>
                        </label>

                        <label className="inline-flex items-center text-gray-600">
                          <input
                            type="radio"
                            name="recommended"
                            value={0}
                            checked={formData.recommended == 0}
                            onChange={handleChange}
                            className="form-radio h-4 w-4 text-blue-600 border border-black"
                          />
                          <span className="ml-2">No</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        Default Upload Image
                      </label>
                      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                        <div className="flex gap-4 flex-wrap">
                          {formData.images.filter((img) => img.isDefault === 1)
                            .length > 0 ? (
                            <div className="flex gap-4 flex-wrap">
                              {formData.images
                                .filter((img) => img.isDefault === 1)
                                .map((img, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={img.url}
                                      alt={img.name || `images-${index}`}
                                      className="w-48 object-cover rounded shadow mb-2"
                                    />
                                    <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                                      Default
                                    </span>
                                    <RiDeleteBin6Line
                                      className="w-5 h-5 cursor-pointer absolute top-1 right-1 text-red-600"
                                      onClick={() => handleImgDelete(img)}
                                    />
                                  </div>
                                ))}
                            </div>
                          ) : null}
                        </div>
                        <input
                          type="file"
                          accept="images/*"
                          onChange={(e) => handleImageUpload(e, 1)}
                          className="hidden"
                          id="fileUploadDefault"
                        />
                        <label
                          htmlFor="fileUploadDefault"
                          className={`bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer ${
                            uploadingDefaultImage
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {uploadingDefaultImage
                            ? "Image Uploading..."
                            : "Add image"}
                        </label>
                        <span className="text-gray-500 text-sm mt-2">
                          or drag and drop to upload
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        Additional Upload Image
                      </label>
                      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                        <div className="flex gap-4 flex-wrap">
                          {formData.images.filter((img) => img.isDefault === 0)
                            .length > 0 ? (
                            <div className="flex gap-4 flex-wrap">
                              {formData.images
                                .filter((img) => img.isDefault === 0)
                                .map((img, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={img.url}
                                      alt={img.name || `images-${index}`}
                                      className="w-48 object-cover rounded shadow mb-2"
                                    />
                                    <RiDeleteBin6Line
                                      className="w-5 h-5 cursor-pointer absolute top-1 right-1 text-red-600"
                                      onClick={() => handleImgDelete(img)}
                                    />
                                  </div>
                                ))}
                            </div>
                          ) : null}
                        </div>
                        <input
                          type="file"
                          accept="images/*"
                          onChange={(e) => handleImageUpload(e, 0)}
                          className="hidden"
                          id="fileUploadAdditional"
                        />
                        <label
                          htmlFor="fileUploadAdditional"
                          className={` text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer ${
                            uploadingAdditionalImage
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {uploadingAdditionalImage
                            ? "Image Uploading..."
                            : "Add image"}
                        </label>
                        <span className="text-gray-500 text-sm mt-2">
                          or drag and drop to upload
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        Default Upload Video
                      </label>

                      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                        {formData.videos?.some(
                          (vid) => vid.isDefault === 1 && vid.url
                        ) ? (
                          <div className="flex gap-4 flex-wrap">
                            {formData.videos
                              .filter((vid) => vid.isDefault === 1 && vid.url)
                              .map((vid, index) => (
                                <div key={index} className="relative mb-2">
                                  {vid.url.endsWith(".zip") ? (
                                    <VideoPlayer zipFile={vid.url} />
                                  ) : (
                                    <video
                                      controls
                                      className="object-cover rounded-lg w-48"
                                      src={vid.url}
                                    />
                                  )}
                                  <RiDeleteBin6Line
                                    className="w-5 h-5 cursor-pointer absolute top-1 right-1 text-red-600"
                                    onClick={() => handleVideoDelete(vid)}
                                  />
                                </div>
                              ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 mb-4">
                            No default video available
                          </span>
                        )}

                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoUpload(e, 1)}
                          className="hidden"
                          id="defaultVideoUpload"
                        />
                        <label
                          htmlFor="defaultVideoUpload"
                          className={`text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer ${
                            uploadingDefaultVideo
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {uploadingDefaultVideo
                            ? "Video Uploading..."
                            : "Add Video"}
                        </label>
                        <span className="text-gray-500 text-sm mt-2">
                          or drag and drop to upload
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6 mt-6">
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        Additional Upload Videos
                      </label>

                      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                        <div className="flex gap-4 flex-wrap">
                          {formData.videos
                            .filter((vid) => vid.isDefault === 0)
                            .map((vid, index) => (
                              <div key={index} className="relative mb-2">
                                {vid.url.endsWith(".zip") ? (
                                  <VideoPlayer zipFile={vid.url} />
                                ) : (
                                  <video
                                    controls
                                    className="object-cover rounded-lg w-48"
                                    src={vid.url}
                                  />
                                )}
                                <RiDeleteBin6Line
                                  className="w-5 h-5 cursor-pointer absolute top-1 right-1 text-red-600"
                                  onClick={() => handleVideoDelete(vid)}
                                />
                              </div>
                            ))}
                        </div>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoUpload(e, 0)}
                          className="hidden"
                          id="additionalVideoUpload"
                        />
                        <label
                          htmlFor="additionalVideoUpload"
                          className={`bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer ${
                            uploadingAdditionalVideo
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {uploadingAdditionalVideo
                            ? "Video Uploading..."
                            : "Add Video"}
                        </label>
                        <span className="text-gray-500 text-sm mt-2">
                          or drag and drop to upload
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      USP Points
                    </label>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={uspInput}
                        onChange={(e) => setUspInput(e.target.value)}
                        placeholder="Add USP point..."
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddUsp}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Add
                      </button>
                    </div>

                    <ul className="space-y-2">
                      {uspListt.map((item, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center p-2 bg-gray-100 rounded"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveUsp(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          Additional Information
                        </label>
                        <input
                          type="text"
                          name="additionalInfo"
                          value={formData.additionalInfo}
                          onChange={handleChange}
                          placeholder="additional information..."
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                  </div>

                  <div className="text-right">
                    <Button
                      className="bg-gray-800 hover:bg-zinc-950 text-white font-bold py-2 px-5 rounded"
                      type="primary"
                      loading={savingLoading}
                      onClick={updateService}
                      icon={savingLoading ? <LoadingOutlined /> : null}
                      // disabled={!isFormValid}
                    >
                      {savingLoading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-4xl mx-auto mb-4">
              <div className="flex justify-center">
                <h2 className="text-gray-700 text-2xl font-bold text-center mb-6">
                  Price Mapping
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Price Code
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Gender
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Price
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceList.map((priceItem, index) => {
                      const priceData = servicePrice.find(
                        (p) => p.priceCodeId === priceItem.id
                      );
                      const maleItem = priceData?.male;
                      const femaleItem = priceData?.female;

                      return (
                        <React.Fragment key={index}>
                          <tr>
                            <td
                              className="border border-gray-300 px-4 py-2"
                              rowSpan={2}
                            >
                              {priceItem.priceCode}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              Male
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <input
                                type="number"
                                className="w-full border border-gray-400 px-2 py-1 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                value={
                                  editedPrices[index]?.male ??
                                  (maleItem ? maleItem : "")
                                }
                                onChange={(e) =>
                                  setEditedPrices((prev) => {
                                    const updated = [...prev];
                                    updated[index] = {
                                      ...updated[index],
                                      male: e.target.value,
                                    };
                                    return updated;
                                  })
                                }
                              />
                            </td>
                            <td
                              className="border border-gray-300 px-4 py-2 row-span-2 align-middle text-center"
                              rowSpan={2}
                            >
                              <div className="flex items-center justify-center h-full">
                                <button
                                  onClick={() => handleAddPrice(priceItem.id)}
                                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                                >
                                  Save
                                </button>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td className="border border-gray-300 px-4 py-2">
                              Female
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <input
                                type="number"
                                className="w-full border border-gray-400 px-2 py-1 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                value={
                                  editedPrices[index]?.female ??
                                  (femaleItem ? femaleItem : "")
                                }
                                onChange={(e) =>
                                  setEditedPrices((prev) => {
                                    const updated = [...prev];
                                    updated[index] = {
                                      ...updated[index],
                                      female: e.target.value,
                                    };
                                    return updated;
                                  })
                                }
                              />
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default EditServices;
