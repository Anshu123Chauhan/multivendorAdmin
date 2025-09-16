import React, { useState } from "react";
import Layout from "../components/layout";
import BackHeader from "../components/backHeader";

export default function AddRole() {
  const [formData, setFormData] = useState({
    name: "",
    status: false,
    permissions: {
      User: { read: false, write: false, update: false, delete: false },
      Product: { read: false, write: false, update: false, delete: false },
      Order: { read: false, write: false, update: false, delete: false },
      Transaction: { read: false, write: false, update: false, delete: false },
      Role: { read: false, write: false, update: false, delete: false },
    },
  });

  const handleCheckboxChange = (role, action) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [role]: {
          ...prev.permissions[role],
          [action]: !prev.permissions[role][action],
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", formData);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <BackHeader backButton={true} link="/userlist" title="Back" />
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
          {/* Header */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Create new role
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Roles list
            </button>
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
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
                  checked={formData.status}
                  onChange={() =>
                    setFormData({ ...formData, status: !formData.status })
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
                    {Object.keys(formData.permissions).map((role) => (
                      <tr key={role}>
                        <td className="border px-4 py-2 font-medium">{role}</td>
                        {["read", "write", "update", "delete"].map((action) => (
                          <td className="border px-4 py-2" key={action}>
                            <input
                              type="checkbox"
                              checked={formData.permissions[role][action]}
                              onChange={() =>
                                handleCheckboxChange(role, action)
                              }
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded border"
                            />
                          </td>
                        ))}
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
