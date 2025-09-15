import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { apiurl } from "../config/config";
import { getCookie } from "../config/webStorage";
import Layout from "../components/layout";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AddSeller = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    businessName: "",
    businessAddress: "",
    phone: "",
    identityProof: "",
    panCard: "",
    aadhaar: "",
    altId: "",
    gstNumber: "",
    accountHolder: "",
    ifscCode: "",
    bankAccount: "",
    addressProof: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const token = getCookie("zrotoken");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!formData.businessName)
      newErrors.businessName = "Business name is required.";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email.";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (!formData.phone.match(/^[0-9]{10}$/))
      newErrors.phone = "Phone number must be 10 digits.";
    if (!formData.gstNumber) newErrors.gstNumber = "GST number is required.";
    if (!formData.accountHolder)
      newErrors.accountHolder = "Account holder name is required.";
    if (!formData.ifscCode) newErrors.ifscCode = "IFSC code is required.";
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
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "")
          formDataToSend.append(key, formData[key]);
      });

      const res = await axios.post(
        `${apiurl}/admin/auth/register`,
        formDataToSend,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success && !res?.data?.data?.message) {
        toast.success("New seller added successfully!");
        setFormData({
          username: "",
          email: "",
          password: "",
          fullName: "",
          businessName: "",
          businessAddress: "",
          phone: "",
          identityProof: "",
          panCard: "",
          aadhaar: "",
          altId: "",
          gstNumber: "",
          accountHolder: "",
          ifscCode: "",
          bankAccount: "",
          addressProof: "",
          image: null,
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
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow space-y-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-center text-[#D4550B]">
            Add New Seller
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal and Business Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4550B]"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4550B]"
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm">{errors.businessName}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Business Address
                </label>
                <input
                  type="text"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4550B]"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4550B]"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4550B]"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Identity Proofs */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Identity Proof
                </label>
                <select
                  name="identityProof"
                  value={formData.identityProof}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4550B]"
                >
                  <option value="">Select</option>
                  <option value="PAN">PAN Card</option>
                  <option value="Aadhaar">Aadhaar Card</option>
                  <option value="Passport">Passport</option>
                  <option value="VoterID">Voter ID</option>
                  <option value="DL">Driving License</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Identity Proof
                </label>
                <input
                  type="text"
                  name="identityProof"
                  placeholder="please select the identity proof"
                  value={formData.identityProof}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4550B]"
                  readOnly={true}
                />
              </div>
            </div>

            {/* Tax & Bank */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  GST Number
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4550B]"
                />
                {errors.gstNumber && (
                  <p className="text-red-500 text-sm">{errors.gstNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  name="accountHolder"
                  value={formData.accountHolder}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4550B]"
                />
                {errors.accountHolder && (
                  <p className="text-red-500 text-sm">{errors.accountHolder}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4550B]"
                />
                {errors.ifscCode && (
                  <p className="text-red-500 text-sm">{errors.ifscCode}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4550B]"
                />
                {errors.bankAccount && (
                  <p className="text-red-500 text-sm">{errors.bankAccount}</p>
                )}
              </div>
            </div>

            {/* Password & Image */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-[#D4550B]"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? <FiEye /> : <FiEyeOff />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Upload Address Proof Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="w-full border px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4550B]"
                />
              </div>
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
