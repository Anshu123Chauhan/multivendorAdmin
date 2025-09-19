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

const EditUser = () => {
   const { id } = useParams();
  const [formData, setFormData] = useState({
    email: "",
    // password: "",
    username: "",
    phone: "",
    role_id: "",
    isActive: true, // default status
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const token = getCookie("zrotoken");
  const [showPassword, setShowPassword] = useState(false);
  const [roleData,setRoleData]=useState([])
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const fetchRoleList = async () => {
    try {
      const response = await axios.get(`${apiurl}/admin/role-permission`, {
        headers: {
          Authorization: token,
        },
      });
      // console.log(response?.data);
      if (response?.data?.data?.length > 0) {
        setRoleData(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    } finally {
    }
  };
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${apiurl}/admin/user-get/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(response?.data?.user);
      if (response?.data?.success) {
        setFormData(response?.data?.user || []);
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchRoleList();
    fetchUserData();
  }, []);
  useEffect(() => {
    fetchUserData();
  }, [id]);

  // Field-level validation
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "userName":
        if (!value.trim()) error = "Full name is required.";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email address.";
        }
        break;
      case "password":
        if (value.length < 6) error = "Password must be at least 6 characters.";
        break;
      case "phone":
        if (!/^[0-9]{10}$/.test(value))
          error = "Phone number must be 10 digits.";
        break;
      case "identityProof":
        if (!value) error = "Role is required.";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`${apiurl}/admin/user-update/${id}`, formData, {
        headers: {
          Authorization: token,
        },
      });
      if (res?.data?.success === true) {
        toast.success(res?.data?.message);
        setFormData({
          email: "",
          // password: "",
          username: "",
          phone: "",
          role_id: "",
          isActive: true,
        });
        navigate("/userlist");
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
        <BackHeader backButton={true} link="/userList" title="Back" />
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl space-y-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-center text-[#D4550B]">
            Edit User
          </h2>

          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-6">
            
              <FloatingInput
                label="Full Name"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                required={true}
              />
              <FloatingInput
                label="Phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required={true}
                length={10}
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
              <FloatingInput
                label="Select Role"
                type="select"
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                error={errors.role_id}
                required={true}
                options={[
                  { value: "", label: "" },
                  ...roleData.map((item) => ({
                    value: item._id,
                    label: item.role_name,
                  })),
                ]}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* <div className="relative">
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
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="isActive"
                      value="true"
                      checked={formData.isActive === true}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, isActive: true }))
                      }
                      className="text-[#D4550B] focus:ring-[#D4550B] border"
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="isActive"
                      value="false"
                      checked={formData.isActive === false}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, isActive: false }))
                      }
                      className="text-[#D4550B] focus:ring-[#D4550B] border"
                    />
                    Inactive
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="w-full bg-[#D4550B] text-white py-2 rounded-lg font-medium hover:bg-[#c3490a] transition"
            >
              {loading ? "Updating..." : "Update User"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditUser;
