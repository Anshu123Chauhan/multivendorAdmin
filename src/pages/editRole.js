import React, { useState, useEffect } from "react";
import BackHeader from "../components/backHeader";
import { useUser } from "../config/userProvider";
import Layout, { Container } from "../components/layout";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { apiurl } from "../config/config";
import { toast } from "react-toastify";
import { Link,useNavigate, useParams } from "react-router-dom";
import { getCookie } from "../config/webStorage";

export default function EditRole() {
  const {id}=useParams();
  console.log(id)

 const token = getCookie("zrotoken");
  const navigate = useNavigate();
  const decodedToken = jwtDecode(token);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    roleName: "",
    role_name:"",
    isActive: false,
    permissions: [
      {
        tab_name: "User",
        p_read: false,
        p_write: false,
        p_update: false,
        p_delete: false,
      },
      {
        tab_name: "Product",
        p_read: false,
        p_write: false,
        p_update: false,
        p_delete: false,
      },
      {
        tab_name: "Order",
        p_read: false,
        p_write: false,
        p_update: false,
        p_delete: false,
      },
      {
        tab_name: "Transaction",
        p_read: false,
        p_write: false,
        p_update: false,
        p_delete: false,
      },
      {
        tab_name: "Role",
        p_read: false,
        p_write: false,
        p_update: false,
        p_delete: false,
      },
      {
        tab_name: "Customer",
        p_read: false,
        p_write: false,
        p_update: false,
        p_delete: false,
      },
      {
        tab_name: "Category",
        p_read: false,
        p_write: false,
        p_update: false,
        p_delete: false,
      },
      {
        tab_name: "Subcategory",
        p_read: false,
        p_write: false,
        p_update: false,
        p_delete: false,
      },
      {
        tab_name: "Brand",
        p_read: false,
        p_write: false,
        p_update: false,
        p_delete: false,
      },
    ],
  });

    useEffect(() => {
      const fetchRole = async () => {
        try {
          const res = await axios.get(`${apiurl}/admin/role-permission/${id}`, {
            headers: { Authorization: token},
          });
          if (res.status === 200) {
            setFormData(res.data.data);
          }
        } catch (error) {
          console.error("Error fetching category:", error);
          toast.error("Failed to fetch category details");
        } finally {
          setLoading(false);
        }
      };
  
      if (id) fetchRole();
    }, [id, token]);

  const handleCheckboxChange = (index, action) => {
    setFormData((prev) => {
      const updatedPermissions = [...prev.permissions];
      updatedPermissions[index] = {
        ...updatedPermissions[index],
        [action]: !updatedPermissions[index][action],
      };
      return { ...prev, permissions: updatedPermissions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.put(
        `${apiurl}/admin/role-permission/${id}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("res", res);
      if (res.data.success === true) {
        setLoading(false);
        toast("Role Updated Successfully");
        navigate("/role");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setLoading(false);
        toast.warn(err.response.data.message);
      } else {
        setLoading(false);
        // console.error(`Error creating Subcategory: ${err.message}`);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <BackHeader backButton={true} link="/userlist" title="Back" />
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
          {/* Header */}
          <div className="flex flex-wrap gap-2 mb-6">
          <Link to="/addRole">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Create new role
            </button>
          </Link>
            <Link to="/role">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Roles list
              </button>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name + Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="w-full sm:w-2/3">
                <label className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={formData.roleName}
                  onChange={(e) =>
                    setFormData({ ...formData, roleName: e.target.value, role_name: e.target.value})
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={() =>
                    setFormData({ ...formData, isActive: !formData.isActive })
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded border"
                />
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Permissions</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 text-sm text-center">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Roles</th>
                      <th className="border px-4 py-2">Read</th>
                      <th className="border px-4 py-2">Write</th>
                      <th className="border px-4 py-2">Update</th>
                      <th className="border px-4 py-2">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.permissions.map((perm, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2 font-medium">
                          {perm.tab_name}
                        </td>
                        {["p_read", "p_write", "p_update", "p_delete"].map(
                          (action) => (
                            <td className="border px-4 py-2" key={action}>
                              <input
                                type="checkbox"
                                checked={perm[action]}
                                onChange={() =>
                                  handleCheckboxChange(index, action)
                                }
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded border"
                              />
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Save button */}
            <div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
