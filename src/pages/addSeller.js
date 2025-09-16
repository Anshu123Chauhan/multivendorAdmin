import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { apiurl } from "../config/config";
import { getCookie } from "../config/webStorage";
import Layout from "../components/layout";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FloatingInput } from "../components/floatingInput";
import BackHeader from "../components/backHeader";

const AddSeller = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    AddProofImg: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const token = getCookie("zrotoken");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
      console.log("Uploaded Image URL:", result.secure_url);
      return result.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!formData.businessName)
      newErrors.businessName = "Business name is required.";
    if (!formData.businessAddress)
      newErrors.businessAddress = "Business address is required.";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email.";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (!formData.phone.match(/^[0-9]{10}$/))
      newErrors.phone = "Phone number must be 10 digits.";
    if (!formData.gstNumber) newErrors.gstNumber = "GST number is required.";
    if (!formData.accountHolder)
      newErrors.accountHolder = "Account holder name is required.";
    if (!formData.ifscCode) newErrors.ifscCode = "IFSC code is required.";
    if (!formData.AddProofImg)
      newErrors.AddProofImg = "Address Proof Image is required";
    if (!formData.identityProofNumber)
      newErrors.identityProofNumber = "Identity Proof Number is required";
    if (!formData.identityProof)
      newErrors.identityProof = "Identity Proof is required";
    if (!formData.bankAccount)
      newErrors.bankAccount = "Bank account number is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      let proofUrl = "";
      if (formData.AddProofImg) {
        proofUrl = await handleFileUpload(formData.AddProofImg);
        if (!proofUrl) {
          toast.error("Failed to upload Address Proof. Try again!");
          setLoading(false);
          return;
        }
      }

      const payload = {
        ...formData,
        AddProofImg: proofUrl,
      };

      const res = await axios.post(`${apiurl}/admin/seller-register`, payload, {
        headers: {
          Authorization: token,
        },
      });

      console.log("create seller------------>", res);

      if (res?.data?.success === true) {
        toast.success(res?.data?.message);
        setFormData({
          email: "",
          password: "",
          fullName: "",
          businessName: "",
          businessAddress: "",
          phone: "",
          identityProof: "",
          panCard: "",
          aadhaar: "",
          gstNumber: "",
          accountHolder: "",
          ifscCode: "",
          bankAccount: "",
          addressProof: "",
          AddProofImg: null,
        });
      } else {
        toast.warning(res?.data?.data?.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <BackHeader backButton={true} link="/sellerList" title="Back" />
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl space-y-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-center text-[#D4550B]">
            Create New Seller
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-6">
              <FloatingInput
                label="Full Name"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                required={true}
              />

              <FloatingInput
                label="Business Name"
                type="text"
                name="businessName"
                value={formData.businessName}
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
                value={formData.businessAddress}
                onChange={handleChange}
                error={errors.businessAddress}
                required={true}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FloatingInput
                label="Phone"
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required={true}
              />
              <FloatingInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required={true}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FloatingInput
                label="Select Identity Proof"
                type="select"
                name="identityProof"
                value={formData.identityProof}
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
              />

              <FloatingInput
                label={`Please enter ${formData.identityProof || "ID Number"}`}
                type="text"
                name="identityProofNumber"
                value={formData.identityProofNumber}
                onChange={handleChange}
                error={errors.identityProofNumber}
                required={true}
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
              <div className="relative">
                <FloatingInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required={true}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>
              <FloatingInput
                label="Upload Address Proof Image"
                type="file"
                name="AddProofImg"
                onChange={handleChange}
                error={errors.AddProofImg}
                required={true}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4550B] text-white py-2 rounded-lg font-medium hover:bg-[#c3490a] transition"
            >
              {loading ? "Adding..." : "Add Seller"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddSeller;
