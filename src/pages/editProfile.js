import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { apiurl } from "../config/config";
import { getCookie } from "../config/webStorage";
import Layout from "../components/layout";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FloatingInput } from "../components/floatingInput";
import BackHeader from "../components/backHeader";
import { useNavigate, useParams } from "react-router-dom";
import { usePermission } from "../components/getPermission";

const EditProfile = () => {
  const { userId: id, userType, email, phone, userName } = usePermission();

  console.log("userType-------------->>", userType);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    businessName: "",
    businessAddress: "",
    phone: "",
    identityProof: "",
    identityProofNumber: "",
    gstNumber: "",
    accountHolder: "",
    ifscCode: "",
    bankAccount: "",
    addressProof: "",
    commission: "",
    isActive: "",
  });
  
  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await axios.get(`${apiurl}/seller/get/${id}`, {
          headers: { Authorization: token },
        });
        console.log(res);
        if (res.status === 200) {
          setFormData(res.data.seller);
        }
      } catch (error) {
        console.error("Error fetching seller:", error);
        toast.error("Failed to fetch seller details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSeller();
  }, [id]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const token = getCookie("zrotoken");

  // 🔹 Field-level validation
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) error = "Full name is required.";
        break;
      case "businessName":
        if (!value.trim()) error = "Business name is required.";
        break;
      case "businessAddress":
        if (!value.trim()) error = "Business address is required.";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email address.";
        }
        break;

      case "phone":
        if (!/^[0-9]{10}$/.test(value))
          error = "Phone number must be 10 digits.";
        break;
      case "gstNumber":
        if (!value.trim()) error = "GST number is required.";
        break;
      case "accountHolder":
        if (!value.trim()) error = "Account holder name is required.";
        break;
      case "ifscCode":
        if (!value.trim()) error = "IFSC code is required.";
        break;
      case "bankAccount":
        if (!value.trim()) error = "Bank account number is required.";
        break;
      case "identityProof":
        if (!value) error = "Identity Proof is required.";
        break;
      case "identityProofNumber":
        if (!value.trim()) error = "Identity Proof Number is required.";
        break;
      case "addressProof":
        if (!value) error = "Address Proof Image is required.";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      validateField(name, files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      return;
    }
    try {
      setLoading(true);
      let proofUrl = "";
      if (formData.addressProof) {
        proofUrl = await handleFileUpload(formData.addressProof);
        if (!proofUrl) {
          toast.error("Failed to upload Address Proof. Try again!");
          setLoading(false);
          return;
        }
      }
      const payload = {
        ...formData,
        addressProof: proofUrl,
      };
      const res = await axios.put(`${apiurl}/seller/update/${id}`, payload, {
        headers: {
          Authorization: token,
        },
      });
      if (res?.data?.success === true) {
        toast.success("Your update profile request has been sent ✅");
        navigate("/dashboard");
        setErrors({});
      } else {
        toast.warning(res?.data?.data?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <BackHeader backButton={true} link="/dashboard" title="Back" />
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl space-y-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-center text-blue-600">
            Update{" "}
            {userType === "Seller"
              ? "Seller"
              : userType === "Admin"
              ? "Admin"
              : ""}{" "}
            Details
          </h2>

          {userType === "Seller" ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-6">
                <FloatingInput
                  label="Full Name"
                  type="text"
                  name="fullName"
                  value={formData?.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  required={true}
                />

                <FloatingInput
                  label="Business Name"
                  type="text"
                  name="businessName"
                  value={formData?.businessName}
                  onChange={handleChange}
                  error={errors.businessName}
                  required={true}
                />
              </div>

              <div className="grid md:grid-cols-1 gap-6">
                <FloatingInput
                  label="Business Address"
                  type="textarea"
                  name="businessAddress"
                  value={formData?.businessAddress}
                  onChange={handleChange}
                  error={errors.businessAddress}
                  required={true}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FloatingInput
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={formData?.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required={true}
                  length={10}
                  disabled={true}
                />
                <FloatingInput
                  label="Email"
                  type="email"
                  name="email"
                  value={formData?.email}
                  onChange={handleChange}
                  error={errors.email}
                  required={true}
                  disabled={true}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FloatingInput
                  label="Select Identity Proof"
                  type="select"
                  name="identityProof"
                  value={formData?.identityProof}
                  onChange={handleChange}
                  error={errors.identityProof}
                  required={true}
                  options={[
                    { value: "", label: "" },
                    { value: "PAN", label: "PAN Card" },
                    { value: "Aadhaar", label: "Aadhaar Card" },
                    { value: "Passport", label: "Passport" },
                    { value: "VoterID", label: "Voter ID" },
                    { value: "DL", label: "Driving License" },
                  ]}
                  disabled={true}
                />

                <FloatingInput
                  label={`Please Enter ${
                    formData.identityProof || "ID Number"
                  }`}
                  type="text"
                  name="identityProofNumber"
                  value={formData?.identityProofNumber}
                  onChange={handleChange}
                  error={errors.identityProofNumber}
                  required={true}
                  disabled={true}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FloatingInput
                  label="GST Number"
                  type="text"
                  name="gstNumber"
                  placeholder="Enter GST Number"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  error={errors.gstNumber}
                  required={true}
                  disabled={true}
                />
                <FloatingInput
                  label="Account Holder Name"
                  type="text"
                  name="accountHolder"
                  value={formData.accountHolder}
                  onChange={handleChange}
                  error={errors.accountHolder}
                  required={true}
                />
                <FloatingInput
                  label="IFSC Code"
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  error={errors.ifscCode}
                  required={true}
                />
                <FloatingInput
                  label="Bank Account Number"
                  type="number"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  error={errors.bankAccount}
                  required={true}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FloatingInput
                  label="Commission in %"
                  type="text"
                  name="commission"
                  value={formData.commission}
                  onChange={handleChange}
                  error={errors.commission}
                  required={true}
                />
                <img src={formData.addressProof} className="w-32 h-auto"></img>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-[#c3490a] transition"
              >
                {loading ? "Sending..." : "Update Profile"}
              </button>
            </form>
          ) : userType === "Admin" ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-6">
                <FloatingInput
                  label="Full Name"
                  type="text"
                  name="fullName"
                  value={userName}
                  //   onChange={handleChange}
                  error={errors.userName}
                  required={true}
                />
                <FloatingInput
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={phone}
                  //   onChange={handleChange}
                  error={errors.phone}
                  required={true}
                  length={10}
                />
              </div>

              <div className="grid md:grid-cols-1 gap-6"></div>

              <div className="grid md:grid-cols-2 gap-6">
                <FloatingInput
                  label="Email"
                  type="email"
                  name="email"
                  value={email}
                  //   onChange={handleChange}
                  error={errors.email}
                  required={true}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-[#c3490a] transition"
              >
                {loading ? "Sending..." : "Update Profile"}
              </button>
            </form>
          ) : (
            ""
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EditProfile;
