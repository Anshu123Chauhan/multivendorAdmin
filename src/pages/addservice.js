import React, { useEffect, useState } from "react";
import Layout, { Container } from "../components/layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../config/webStorage";
import { apiurl } from "../config/config";
import { DynamicLoader } from "../components/loader";
import BackHeader from "../components/backHeader";
import { message, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import aws from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import logo from "../assets/logo1.png";
import Delete from "../assets/delete.gif";
import { RiDeleteBin6Line } from "react-icons/ri";
import VideoPlayer from "../components/videoPlayer";

const Addservice = () => {
  const token = getCookie("zrotoken");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [uploadingDefaultImage, setUploadingDefaultImage] = useState(false);
  const [uploadingAdditionalImage, setUploadingAdditionalImage] =
    useState(false);
  const [uploadingDefaultVideo, setUploadingDefaultVideo] = useState(false);
  const [uploadingAdditionalVideo, setUploadingAdditionalVideo] =
    useState(false);

  // Single state object for all form data
  const [formData, setFormData] = useState({
    categoryId: "",
    subCategoryId: "",
    serviceName: "",
    description: "",
    images: [],
    status: true,
    storePrices: [],
    duration: "",
    // gender: "",
    videos: [],
    usp: [],
    tags: "",
    recommended: "",
    serviceCode: "",
    additionalInfo: "",
    mainService:"",
    variants:"",
    concern:"",
  });

  const [categorydata, setCategoryData] = useState([]);
  const [subcategorydata, setSubcategoryData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [servicePriceCode, setServicePriceCode] = useState([]);
  const [malePrice, setMalePrice] = useState();
  const [femalePrice, setFemalePrice] = useState();
  const [createdServiceResponse, setCreatedServiceResponse] = useState("");
  const [priceInputs, setPriceInputs] = useState([]);
  const [isUploadbtn, setIsUploadbtn] = useState(false);
  
  

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "storePrices" ? parseFloat(value) || 0 : value,
    }));
  };

  const [uspInput, setUspInput] = useState("");

  // Handle adding a new USP point
  const handleAddUsp = () => {
    if (uspInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        usp: [...prev.usp, uspInput.trim()],
      }));
      setUspInput("");
    }
  };

  // Handle removing a USP point
  const handleRemoveUsp = (index) => {
    setFormData((prev) => ({
      ...prev,
      usp: prev.usp.filter((_, i) => i !== index),
    }));
  };

  // Validate form

  const isFormValid =
    formData?.serviceName?.trim() &&
    formData?.categoryId?.trim() &&
    formData?.subCategoryId?.trim() &&
    formData?.description?.trim() &&
    formData?.tags?.trim() &&
    formData?.serviceCode?.trim() &&
    formData?.images?.some((img) => img.url?.trim()) &&
    formData?.videos?.some((video) => video.url?.trim()) &&
    formData?.usp?.some((usp) => usp?.trim());
  // && formData?.storePrices.length > 0;

  //fetch store list

  //fetch category list
  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/admin/category/getCategories`,
        {
          headers: {
            Authorization: token,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      // console.log(response?.data);
      if (response?.data?.data?.length > 0) {
        setCategoryData(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    }
  };

  const fetchSubCategoryList = async (categoryId) => {
    try {
      const response = await axios.get(
        `${apiurl}/admin/subcategory/getsubCategories`,
        {
          headers: {
            Authorization: token,
            "ngrok-skip-browser-warning": "69420",
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
    }
  };

  const fetchStoreList = async () => {
    try {
      const response = await axios.get(`${apiurl}/admin/store/storeListing`, {
        headers: {
          Authorization: token,
        },
      });
      // console.log("storeListing------------->", response?.data);
      if (response?.data?.data?.length > 0) {
        setStoreData(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    }
  };

  const fetchPricecode = async () => {
    try {
      const response = await axios.get(`${apiurl}/admin/pricecode/getAll`, {
        headers: {
          Authorization: token,
        },
      });
      // console.log("pricecode------------->", response?.data);
      if (response?.data?.success === true) {
        const enrichedData = response.data.data.map((item) => ({
          ...item,
          malePrice: "",
          femalePrice: "",
        }));
        setServicePriceCode(enrichedData);
        setPriceInputs(enrichedData);
      }
    } catch (error) {
      console.error("Error fetching pricecode: ", error);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...priceInputs];
    updated[index][field] = value;
    setPriceInputs(updated);
  };

  const handleAddPrice = async (item, index) => {
    setLoading(true);
    const input = priceInputs[index];
    const myData = {
      priceCodeId: Number(item.id),
      malePrice: Number(input.malePrice),
      femalePrice: Number(input.femalePrice),
      serviceId: Number(createdServiceResponse.id),
    };

    try {
      const response = await axios.post(
        `${apiurl}/admin/store/createStore`,
        myData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // console.log("Price added successfully response", response);
      if (response?.status == 200) {
        setLoading(false);
        toast("Price added! successfully");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error adding price:", error);
    }
  };

  useEffect(() => {
    fetchStoreList();
    fetchCategoryList();
    fetchPricecode();
    fetchSubCategoryList();
  }, []);
  // Create Category
  const createService = async () => {
    const {
      categoryId,
      subCategoryId,
      serviceName,
      description,
      images,
      status,
      videos,
      duration,
      // gender,
      storePrices,
      serviceCode,
      additionalInfo,
      variants,
      mainService,
      concern,
    } = formData;

    try {
      setSavingLoading(true);
      if (
        categoryId &&
        subCategoryId &&
        serviceName &&
        description &&
        images &&
        status &&
        videos &&
        storePrices &&
        duration &&
        serviceCode
        // gender
      ) {
        const payload = {
          ...formData,
          usp: Array.isArray(formData.usp)
            ? formData.usp.join(",")
            : formData.usp, additionalInfo,
        };
        const res = await axios.post(
          `${apiurl}/admin/service/createService`,
          payload,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("create service res----------->>", res.data);
        if (res?.data?.success === true || res?.data?.statusCode === 200) {
          setCreatedServiceResponse(res?.data?.data);
          setSavingLoading(false);
          toast("Service Created Successfully");
          // navigate("/service");
        }
        if (res.status === 200) {
          setSavingLoading(false);
          toast.warn("Category Already Exist");
        }
      } else {
        toast.danger("Please fill all the fields");
      }
    } catch (err) {
      setSavingLoading(false);
      console.error(`Error creating category: ${err.message}`);
    }
  };

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
      console.log(response.data);

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

  const handleVideoUpload = async (e, isDefaultValue) => {
    const isDefault = isDefaultValue === 1;
    const setLoading = isDefault
    ? setUploadingDefaultVideo
    : setUploadingAdditionalVideo;
    
    const input = e.target; // reference the input
    const file = input.files[0]
    
    try {
      setLoading(true);
      setIsUploadbtn(true)
      setIsUploadbtn(isDefault ? "default" : "additional");
      if (!file) return;
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
        setIsUploadbtn(false)
        toast.error("Video is too large. Please upload a smaller file.");
        return;
      }
      console.log('response-----------upload video-->', response)
      const data = await response.json();

      const { url } = data;
      const original_filename = file.name;

      if (url) {
        setIsUploadbtn(false)
        setFormData((prev) => {
          let updatedVideos = [...prev.videos];

          if (isDefault) {
            updatedVideos = updatedVideos.filter((v) => v.isDefault !== 1);
            updatedVideos.push({
              url: url.publicURL,
              name: original_filename,
              language: "English",
              isDefault: 1,
            });
          } else {
            updatedVideos.push({
              url: url.publicURL,
              name: original_filename,
              language: "Other",
              isDefault: 0,
            });
          }

          return { ...prev, videos: updatedVideos };
        });

        toast.success("Video uploaded successfully!");
      }
    } catch (error) {
      setIsUploadbtn(false)
      console.error("Error uploading video:", error);
      toast.error("Failed to upload video. Please try again.");
    } finally {
      setIsUploadbtn(false)
      setLoading(false);
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

  const handlePriceChange = (storeId, price) => {
    const parsedPrice = parseFloat(price) || 0;

    setFormData((prev) => {
      const updatedPrices = prev.storePrices.filter(
        (item) => item.storeId !== storeId
      );

      return {
        ...prev,
        storePrices: [...updatedPrices, { storeId, price: parsedPrice }],
      };
    });
  };

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
                {createdServiceResponse.length === 0 && (
                  <div className="flex flex-col gap-6 mb-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Choose Category
                        </label>
                        <select
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={(e) => {
                            handleChange(e);
                            fetchSubCategoryList(e.target.value);
                          }}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Category</option>
                          {categorydata.map((item) => (
                            <option value={item.id} key={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Choose Sub Category
                        </label>
                        <select
                          name="subCategoryId"
                          value={formData.subCategoryId}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Sub Category</option>
                          {subcategorydata.map((item) => (
                            <option value={item.id} key={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Service Name
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
                          Tag
                        </label>
                        <input
                          type="text"
                          name="tags"
                          value={formData.tags}
                          onChange={handleChange}
                          placeholder="Enter Tag name..."
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Service Code
                        </label>
                        <input
                          type="text"
                          name="serviceCode"
                          value={formData.serviceCode}
                          onChange={handleChange}
                          placeholder="Enter Service code..."
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Duration (in mins)
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
                              value="yes"
                              checked={formData.recommended === "yes"}
                              onChange={handleChange}
                              className="h-4 w-4 text-blue-600 border border-black"
                            />

                            <span className="ml-2">Yes</span>
                          </label>

                          <label className="inline-flex items-center text-gray-600">
                            <input
                              type="radio"
                              name="recommended"
                              value="no"
                              checked={formData.recommended === "no"}
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
                            {formData.images.filter(
                              (img) => img.isDefault === 1
                            ).length > 0 ? (
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
                            {formData.images.filter(
                              (img) => img.isDefault === 0
                            ).length > 0 ? (
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
                          {formData.videos
                            .filter((vid) => vid.isDefault === 1)
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
                              {!uploadingDefaultVideo &&  <RiDeleteBin6Line
                                  className="w-5 h-5 cursor-pointer absolute top-1 right-1 text-red-600"
                                  onClick={() => handleVideoDelete(vid)}
                                />}
                              </div>
                            ))}

                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleVideoUpload(e, 1)}
                            className="hidden"
                            id="defaultVideoUpload"
                            disabled={uploadingAdditionalVideo || isUploadbtn}
                          />
                          <label
                            htmlFor="defaultVideoUpload"
                            className={`text-white px-3 py-2 rounded ${
                              uploadingDefaultVideo ||
                              isUploadbtn 
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 cursor-pointer"
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
                                 { !uploadingAdditionalVideo && <RiDeleteBin6Line
                                    className="w-5 h-5 cursor-pointer absolute top-1 right-1 text-red-600"
                                    onClick={() => handleVideoDelete(vid)}
                                  />}
                                </div>
                              ))}
                          </div>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleVideoUpload(e, 0)}
                            className="hidden"
                            id="additionalVideoUpload"
                            disabled={uploadingAdditionalVideo || isUploadbtn}

                          />
                          <label
                            htmlFor="additionalVideoUpload"
                            className={`text-white px-3 py-2 rounded ${
                              uploadingAdditionalVideo ||
                              isUploadbtn
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 cursor-pointer"
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

                      <div className="space-y-2">
                        {formData.usp.map((point, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-200 rounded"
                          >
                            <span>{point}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveUsp(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
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
                        className={`bg-gray-800 hover:bg-zinc-950 hover:text-white font-bold py-2 px-5 rounded`}
                        type="primary"
                        loading={savingLoading}
                        onClick={createService}
                        icon={savingLoading ? <LoadingOutlined /> : null}
                        disabled={!isFormValid}
                      >
                        {savingLoading ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                )}
                {createdServiceResponse.length !== 0 && (
                  <div className="max-w-4xl mx-auto mb-4">
                    <div className="text-left text-2xl text-gray-600 font-bold">
                      {createdServiceResponse?.serviceName}
                    </div>
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
                          {servicePriceCode.map((item, index) => (
                            <React.Fragment key={index}>
                              <tr>
                                <td
                                  className="border border-gray-300 px-4 py-2"
                                  rowSpan={2}
                                >
                                  {item.priceCode}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                  Male
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                  <input
                                    type="number"
                                    className="w-full border border-gray-400 px-2 py-1 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    value={priceInputs[index]?.malePrice || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "malePrice",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td
                                  className="border border-gray-300 px-4 py-2"
                                  rowSpan={2}
                                >
                                  <div className="flex items-center justify-center h-full">
                                    <button
                                      onClick={() =>
                                        handleAddPrice(item, index)
                                      }
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
                                      priceInputs[index]?.femalePrice || ""
                                    }
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "femalePrice",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default Addservice;
