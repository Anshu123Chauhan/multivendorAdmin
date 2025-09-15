import React, { useState, useEffect } from "react";
import Layout, { Container } from "../components/layout";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin6Fill } from "react-icons/ri";
import InputContainer from "../components/inputContainer";
import { FiUpload } from "react-icons/fi";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { BlackButton } from "../components/buttonContainer";
import { useUser } from "../config/userProvider";
import axios from "axios";
import { apiurl } from "../config/config";


const Integration = () => {
  let { userData } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [activeSection, setActiveSection] = useState("documentation");

  // Verification states
  const [verificationData, setVerificationData] = useState({
    gst: {
      number: "",
      isVerified: false,
      error: "",
      document: null,
    },
    pan: {
      number: "",
      isVerified: false,
      error: "",
      document: null,
    },
    fssai: {
      number: "",
      isVerified: false,
      error: "",
      document: null,
    },
    trademark: {
      number: "",
      isVerified: false,
      error: "",
      document: null,
    },
  });

  const handleVerificationInput = (type, value) => {
    setVerificationData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        number: value,
        error: "",
        isVerified: false,
      },
    }));
  };

  const handleVerify = (type) => {
    // Simulate verification API call
    setTimeout(() => {
      if (verificationData[type].number.length < 5) {
        setVerificationData((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            error: "Invalid number format",
            isVerified: false,
          },
        }));
      } else {
        setVerificationData((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            error: "",
            isVerified: true,
          },
        }));
      }
    }, 1000);
  };

  const handleFileUpload = (type, file) => {
    setVerificationData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        document: file,
      },
    }));
  };





  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  const deletePopup = () => {
    setShowDeleteMemberPopup(!showDeleteMemberPopup);
  };
  const handleDelete = () => {
    setShowDeleteMemberPopup(false);
  };

  const [copiedStatus, setCopiedStatus] = useState({
    url1: false,
    url2: false,
    url3: false,
    url4: false,
  });

  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
  const [showDeleteMemberPopup, setShowDeleteMemberPopup] = useState(false);
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    stores: true,
    products: true,
    orders: true,
    settings: true,
    reports: true,
    users: true,
    analytics: true,
    magento: false,
    shopify: false,
    manual: true,
  });

  const apiUrl = {
    url1: "http://example.com/1",
    url2: "http://example.com/2",
    url3: "http://example.com/3",
    url4: "http://example.com/4",
  };

  const copyToClipboard = (urlToCopy, key) => {
    navigator.clipboard
      .writeText(urlToCopy)
      .then(() => {
        setCopiedStatus((prevStatus) => ({
          ...prevStatus,
          [key]: true,
        }));

        setTimeout(() => {
          setCopiedStatus((prevStatus) => ({
            ...prevStatus,
            [key]: false,
          }));
        }, 3000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
  };
  console.log(formdata);

  const handleToggleChange = (key) => {
    setFormdata((prevFormData) => ({
      ...prevFormData,
      [key]: !prevFormData[key],
    }));
    if (key === "shopify" || key === "magento") {
      setShowPopup(true);
      setPopupType(key);
    }
  };

  const TabBarItem = ({ label, isActive, onClick }) => {
    return (
      <button
        className={`md:py-2 px-6 text-xs md:text-base h-10 rounded-md rounded-b-none  ${
          isActive
            ? "md:font-semibold bg-zinc-950 text-white "
            : " text-gray-500 hover:text-black"
        }`}
        onClick={onClick}
      >
        {label}
      </button>
    );
  };

  const Content = ({ label, value }) => {
    return (
      <div className="grid grid-cols-2 text-xs md:text-base">
        <p className="font-semibold ">{label}:</p>
        <p className="text-slate-500">{value}</p>
      </div>
    );
  };

  const [venderDetails, setVenderDetails] = useState("");
  let vendorObjId = userData?.vendorDetails?.vendorObjId;

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiurl}/api/vendor/get/${vendorObjId}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setVenderDetails(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  console.log("userData", userData);
  console.log("venderDetails", venderDetails);

  //------------------------------------------ Pan DATA Handler -------------------------------------------------------------
  const [panNumber, setPanNumber] = useState("");
  const [panError, setPanError] = useState("");
  const [panDocument, setPanDocument] = useState("");
  const [verifiedPan, setVerifedPan] = useState(false);

  const PanDocUploadHandler = () => {
    if (panDocument && panNumber) {
      let data = JSON.stringify({
        vendorObjId: vendorObjId,
        panNumber: panNumber,
        panDocument: panDocument?.name,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${apiurl}/api/vendor/update/pan`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  //------------------------------------------ Document DATA Handler -------------------------------------------------------------
  const [gstNumber, setGstNumber] = useState("")
  const [gstError, setGstError] = useState("")
const [gstDocument, setGstDocument] = useState("")
 const [verifiedGst, setVerifedGst] = useState(false);

const GstDocUploadHandler = () => { 
  if (gstDocument && gstNumber) {
    let data = JSON.stringify({
      vendorObjId: vendorObjId,
      gstNumber: gstNumber,
      gstDocument: gstDocument?.name,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiurl}/api/vendor/update/gst`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }
 }


console.log("gstDocument", gstDocument);
  return (
    <Layout>
      <Container>
        <div className="flex flex-wrap justify-between w-full h-full ">
          <div className="flex flex-col  px-2 py-2 w-[100%] h-[100%] overflow-scroll">
            <div className="flex flex-col md:flex-row  ">
              <div className="flex flex-col gap-3   w-full">
                <p className="text-base md:text-xl font-semibold ">
                  Owner Information
                </p>
                <div className="p-2 px-5 md:p-10 flex flex-col gap-3">
                  <Content
                    label="Name"
                    value={venderDetails?.ownerDetails?.name}
                  />
                  <Content
                    label="Email"
                    value={venderDetails?.ownerDetails?.email}
                  />
                  <Content
                    label="Phone"
                    value={venderDetails?.ownerDetails?.phone}
                  />
                </div>
              </div>

              <div className="flex flex-col  w-full ">
                <p className="text-base md:text-xl font-semibold ">
                  Store Information
                </p>
                <div className="p-2 px-5 md:p-10 flex flex-col gap-3">
                  <Content
                    label="Store Name"
                    value={userData?.storeDetails?.storeName}
                  />
                  {/* <Content
                    label="Store Code"
                    value={userData?.storeDetails?.storeCode}
                  /> */}
                  <Content
                    label="Store Email"
                    value={userData?.storeDetails?.storeEmail}
                  />

                  <Content label="Store Phone" value={userData?.phone} />
                  <Content
                    label="Store Address"
                    value={
                      <span>
                        {userData?.addressDetails?.province_code},
                        {userData?.addressDetails?.address},
                        {userData?.addressDetails?.city}
                      </span>
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full border-b-2 mt-6 md:mt-0">
              {/* <TabBarItem
                label="Information"
                isActive={activeSection === "information"}
                onClick={() => setActiveSection("information")}
              /> */}
              <TabBarItem
                label="documentation"
                isActive={activeSection === "documentation"}
                onClick={() => setActiveSection("documentation")}
              />
              {/* <TabBarItem
                label="API Generation"
                isActive={activeSection === "api"}
                onClick={() => setActiveSection("api")}
              /> */}
              <TabBarItem
                label="Integration Permissions"
                isActive={activeSection === "permissions"}
                onClick={() => setActiveSection("permissions")}
              />
            </div>
            <div className="h-[80%]">
              {activeSection === "documentation" && (
                <div className="flex flex-col gap-6 mt-10">
                  {/* GST Verification */}
                  <div className="bg-white p-2 md:p-6 rounded-lg shadow-sm border">
                    <h3 className="text-sm md:text-lg font-semibold mb-4">
                      GST Verification
                    </h3>
                    <div className="flex gap-4 items-start w-full">
                      <div className="w-full">
                        <input
                          type="text"
                          placeholder="Enter GST Number"
                          className="w-full p-2 border rounded md:text-base text-xs focus:outline-none focus:ring-2 focus:ring-slate-500"
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value)}
                        />
                        {gstError && (
                          <p className="text-red-500 text-sm mt-1">
                            {gstError}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setVerifedGst(true)}
                        className={`px-4 py-2   rounded hover:bg-slate-700 text-xs md:text-base ${
                          verifiedGst
                            ? "text-green-700"
                            : "bg-zinc-950 text-white"
                        } `}
                      >
                        {verifiedGst ? "Verified" : "Verify"}
                      </button>
                    </div>
                    {verifiedGst && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-green-600 mb-3">
                          <TiTick size={20} />
                          <span>Verified Successfully</span>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              id="gst-doc"
                              className="hidden"
                              onChange={(e) =>
                                setGstDocument(e.target.files[0])
                              }
                            />
                            <label
                              htmlFor="gst-doc"
                              className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                            >
                              <FiUpload />
                              <span>Upload Document</span>
                            </label>

                            {gstDocument && (
                              <span className="text-sm text-gray-600">
                                {gstDocument?.name}
                              </span>
                            )}
                          </div>
                          <BlackButton
                            title="Upload"
                            handleSubmit={GstDocUploadHandler}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PAN Verification */}
                  <div className="bg-white p-2 md:p-6 rounded-lg shadow-sm border">
                    <h3 className="text-sm md:text-lg font-semibold mb-4">
                      PAN Verification
                    </h3>
                    <div className="flex gap-4 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Enter PAN Number"
                          className="w-full p-2 border rounded md:text-base text-xs focus:outline-none focus:ring-2 focus:ring-slate-500"
                          value={panNumber}
                          onChange={(e) => setPanNumber(e.target.value)}
                        />
                        {verificationData.pan.error && (
                          <p className="text-red-500 text-sm mt-1">
                            {verificationData.pan.error}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => setVerifedPan(true)}
                        className={`px-4 py-2   rounded hover:bg-slate-700 text-xs md:text-base ${
                          verifiedPan
                            ? "text-green-700"
                            : "bg-zinc-950 text-white"
                        } `}
                      >
                        {verifiedPan ? "Verified" : "Verify"}
                      </button>
                    </div>
                    {verifiedPan && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-green-600 mb-3">
                          <TiTick size={20} />
                          <span>Verified Successfully</span>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              id="pan-doc"
                              className="hidden"
                              onChange={(e) =>
                                setPanDocument(e.target.files[0])
                              }
                            />
                            <label
                              htmlFor="pan-doc"
                              className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                            >
                              <FiUpload />
                              <span>Upload Document</span>
                            </label>
                            {panDocument && (
                              <span className="text-sm text-gray-600">
                                {panDocument.name}
                              </span>
                            )}
                          </div>
                          <BlackButton
                            title="Upload"
                            handleSubmit={PanDocUploadHandler}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* {activeSection === "information" && (
                <div className="flex flex-col md:flex-row ">
                  <div className="flex flex-col gap-3 md:p-10  w-full">
                    <p className="text-base md:text-xl font-semibold ">
                      Personal Information
                    </p>
                    <div className="p-5 md:p-10 flex flex-col gap-3">
                      <Content label="Name" value="John Doe" />
                      <Content label="Email" value="john.doe@example.com" />
                      <Content label="Phone" value="+123 456 7890" />
                    </div>
                  </div>

                  <div className="flex flex-col  w-full md:p-10">
                    <p className="text-base md:text-xl font-semibold ">Store Information</p>
                    <div className="p-5 md:p-10 flex flex-col gap-3">
                      <Content label="Store Name" value="ABC Store" />
                      <Content label="Store Code" value="ST1234" />
                      <Content label="Manager Name" value="Jane Doe" />
                      <Content label="Store Phone" value="+123 456 7890" />
                      <Content
                        label="Store Address"
                        value="123 Main St, City, Country"
                      />
                    </div>
                  </div>
                </div>
              )} */}

              {activeSection === "api" && (
                <div className="flex flex-col md:gap-8 mt-10">
                  <div className="text-gray-700 bg-slate-50 border-2 border-slate-200 px-2 py-2 md:px-6 md:py-4 rounded-lg w-full">
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 space-x-4">
                      <div>
                        <label
                          htmlFor="apiName"
                          className="block text-gray-700 text-sm font-medium md:min-w-[120px]"
                        >
                          API Name
                        </label>
                      </div>
                      <div className="flex flex-grow">
                        <input
                          type="text"
                          id="apiName"
                          className="flex-grow border border-slate-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          placeholder="Enter API name"
                        />
                      </div>
                      <div>
                        <button className="bg-slate-600 text-white text-xs md:text-base px-2 py-1 md:px-4 md:py-2 rounded-md hover-bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500">
                          Generate API
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-gray-700 border-2 border-slate-200 px-2 py-2 md:px-6 md:py-4 rounded-lg">
                    <div>
                      <h4 className="text-base font-medium text-slate-500 pl-6">
                        Your APIs
                      </h4>
                    </div>
                    <div className="flex flex-col gap-6 ">
                      <div className="text-gray-700 bg-slate-50 border-2 border-slate-200 px-2 py-2 md:px-6 md:py-4 rounded-lg w-full">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">API Key 1</span>
                          <button
                            onClick={() => copyToClipboard(apiUrl.url1, "url1")}
                            className="bg-slate-600 text-white px-4 py-1 rounded hover-bg-slate-700 text-xs md:text-sm"
                          >
                            {copiedStatus.url1 ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {apiUrl.url2}
                          </span>
                          <button
                            onClick={() => copyToClipboard(apiUrl.url2, "url2")}
                            className="bg-slate-600 text-white px-2 md:px-4 py-1 rounded hover-bg-slate-700 text-xs md:text-sm"
                          >
                            {copiedStatus.url2 ? "Copied" : "Copy URL"}
                          </button>
                        </div>
                      </div>

                      <div className="text-gray-700 bg-slate-50 border-2 border-slate-200 px-2 py-2 md:px-6 md:py-4 rounded-lg w-full">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">API Key 2</span>
                          <button
                            onClick={() => copyToClipboard(apiUrl.url3, "url3")}
                            className="bg-slate-600 text-white px-4 py-1 rounded hover-bg-slate-700 text-sm"
                          >
                            {copiedStatus.url3 ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {/* https://api.example.com/v1/key2 */}
                            {apiUrl.url4}
                          </span>
                          <button
                            onClick={() => copyToClipboard(apiUrl.url4, "url4")}
                            className="bg-slate-600 text-white px-2 md:px-4 py-1 rounded hover-bg-slate-700 text-xs md:text-sm"
                          >
                            {copiedStatus.url4 ? "Copied" : "Copy URL"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeSection === "permissions" && (
                <div className="flex flex-col gap-2 mt-10 bg-zinc-50 p-4  rounded-md">
                  <div className="text-gray-700   py-3 border-b">
                    <div className="flex justify-between">
                      <label
                        htmlFor="gupshup"
                        className="block text-gray-700 text-sm font-medium md:min-w-[120px]"
                      >
                        Gupshup
                      </label>
                      <div
                        onClick={() => handleToggleChange("gupshup")}
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                          formdata.gupshup ? "bg-gray-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
                            formdata.gupshup ? "translate-x-6" : ""
                          } transition-transform`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-700   py-3 border-b">
                    <div className="flex justify-between">
                      <label
                        htmlFor="shopify"
                        className="block text-gray-700 text-sm font-medium md:min-w-[120px]"
                      >
                        Shopify
                      </label>
                      <div
                        onClick={() => handleToggleChange("shopify")}
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                          formdata.shopify ? "bg-gray-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
                            formdata.shopify ? "translate-x-6" : ""
                          } transition-transform`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-700   py-3 rounded-lg">
                    <div className="flex justify-between">
                      <label
                        htmlFor="manual"
                        className="block text-gray-700 text-sm font-medium md:min-w-[120px]"
                      >
                        Manual
                      </label>
                      <div
                        onClick={() => handleToggleChange("manual")}
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                          formdata.manual ? "bg-gray-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
                            formdata.manual ? "translate-x-6" : ""
                          } transition-transform`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              {popupType.charAt(0).toUpperCase() + popupType.slice(1)}{" "}
              Integration
            </h2>
            <input
              type="text"
              placeholder="API Endpoint"
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Access Token"
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Secret Key"
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="API Key"
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Version"
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Integration;
