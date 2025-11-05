import React, { useEffect, useMemo, useState } from "react";
import { FiFilter, FiEdit2, FiTrash2, FiRefreshCcw, FiArrowLeft } from "react-icons/fi";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/layout";
import { toast } from "react-toastify";
import { getCookie } from "../config/webStorage";
import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_APIURL || "http://localhost:5000/api";

const ManageVendor = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const token = getCookie("zrotoken");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
    const [categoryName, setCategoryName] = useState("");
    const [editId, setEditId] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [vendorCountFilter, setVendorCountFilter] = useState("");


    const filtered = useMemo(() => {
        let list = categories;

        // 🧩 Filter by name (case-insensitive)
        if (query.trim()) {
            const lowerQuery = query.toLowerCase();
            list = list.filter((c) => c.name.toLowerCase().includes(lowerQuery));
        }

        // 🧮 Filter by vendor count (numeric match)
        if (vendorCountFilter !== "" && !isNaN(vendorCountFilter)) {
            const count = parseInt(vendorCountFilter, 10);
            list = list.filter((c) => c.vendorsCount === count);
        }

        return list;
    }, [categories, query, vendorCountFilter]);


    useEffect(() => {
        const closeFilter = (e) => {
            if (!e.target.closest(".relative")) setShowFilter(false);
        };
        document.addEventListener("click", closeFilter);
        return () => document.removeEventListener("click", closeFilter);
    }, []);


    const fetchCategories = async () => {
        try {
            setLoading(true);
            setErr("");
            const res = await axios.get(`${API_URL}/admin/list-seller-categories`, {
                headers: { Authorization: token },
            });

            const raw = res?.data?.data ?? [];
            const normalized = raw.map((c) => ({
                _id: c._id,
                name: c.sellerCategoryName || "-",
                vendorsCount: 0,
            }));

            setCategories(normalized);
        } catch (e) {
            toast.error(e?.response?.data?.message || "Failed to load categories");
            setErr(e?.message || "Failed to load categories.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreateCategory = async () => {
        if (!newCategory.trim()) {
            toast.warn("Please enter a category name");
            return;
        }
        try {
            await axios.post(
                `${API_URL}/admin/seller-category`,
                { sellerCategoryName: newCategory },
                { headers: { Authorization: token } }
            );
            toast.success("Category created successfully!");
            setShowAddModal(false);
            setNewCategory("");
            fetchCategories();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to create category");
        }
    };
      const deleteSeller = (id) => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won’t be able to revert this action!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            console.log("Deleting admin with id:", id);
            handleDeleteCategory(id);
            Swal.fire("Deleted!", "The admin has been deleted.", "success");
          }
        });
      };


    const handleEditClick = (category) => {
        setEditId(category._id);
        setCategoryName(category.name);
        setModalMode("edit");
        setShowModal(true);
    };

    const handleUpdateCategory = async () => {
        if (!categoryName.trim()) {
            toast.warn("Please enter a category name");
            return;
        }
        try {
            await axios.put(
                `${API_URL}/admin/editSellerCategory/${editId}`,
                { sellerCategoryName: categoryName },
                { headers: { Authorization: token } }
            );
            toast.success("Category updated successfully!");
            setShowModal(false);
            setCategoryName("");
            setEditId(null);
            fetchCategories();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update category");
        }
    };


    const handleDeleteCategory = async (id) => {
        try {
            await axios.delete(`${API_URL}/admin/deleteSellerCategory/${id}`, {
                headers: { Authorization: token },
            });
            toast.success("Category deleted successfully!");
            fetchCategories();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete category.");
        }
    };

    return (
        <Layout>
            <div className="min-h-screen flex flex-col p-6">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <button
                        className="text-gray-700 hover:text-black"
                        onClick={() => navigate(-1)}
                        aria-label="Back"
                    >
                        <FiArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-semibold text-black">Manage Categories</h1>
                </div>

                {/* Search + Add */}
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <div className="flex items-center gap-2 w-full sm:w-1/3">
                        <input
                            type="text"
                            placeholder="Suggestive/Guided Search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                        />
                        <div className="relative">
                            <button
                                className="p-2 text-gray-600 hover:text-black border border-gray-300 rounded-lg"
                                title="Filter"
                                type="button"
                                onClick={() => setShowFilter(!showFilter)}
                            >
                                <FiFilter size={18} />
                            </button>

                            {showFilter && (
                                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-96 z-50">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-1">
                                        Filter Categories
                                    </h4>

                                    {/* Filter by Name */}
                                    <div className="mb-3">
                                        <label className="block text-xs text-gray-600 mb-1">Category Name</label>
                                        <input
                                            type="text"
                                            placeholder="Search by name..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                        />
                                    </div>

                                    {/* Filter by Vendor Count */}
                                    <div className="mb-3">
                                        <label className="block text-xs text-gray-600 mb-1">Vendor Count</label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Enter count..."
                                            onChange={(e) => setVendorCountFilter(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                                        />
                                    </div>

                                    <div className="flex justify-between mt-3">
                                        <button
                                            onClick={() => {
                                                setQuery("");
                                                setVendorCountFilter("");
                                            }}
                                            className="px-3 py-1 border border-gray-300 rounded-md text-xs text-gray-600 hover:bg-gray-100"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            onClick={() => setShowFilter(false)}
                                            className="px-3 py-1 border border-gray-300 rounded-md text-xs text-gray-600 hover:bg-gray-100"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3 sm:mt-0">
                        <button
                            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg text-black hover:bg-gray-100 transition"
                            type="button"
                            onClick={() => setShowAddModal(true)}
                        >
                            <MdAdd size={18} /> Add category
                        </button>
                        <button
                            className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:text-black disabled:opacity-50"
                            onClick={fetchCategories}
                            disabled={loading}
                            title="Refresh"
                            type="button"
                        >
                            <FiRefreshCcw size={18} />
                        </button>
                    </div>
                </div>

                {showAddModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
                            <button
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                                onClick={() => setShowAddModal(false)}
                            >
                                ✕
                            </button>
                            <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-3">
                                <MdAdd size={20} className="text-gray-700" /> Create Category
                            </h2>
                            <div className="mt-4">
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Category Name"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                            </div>
                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={handleCreateCategory}
                                    className="px-6 py-2 bg-gray-100 border border-black text-black rounded-full text-sm font-medium hover:bg-gray-800 hover:text-white transition"
                                >
                                    Create Category
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* States */}
                {err && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {err}
                    </div>
                )}
                {loading && (
                    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Loading categories…
                    </div>
                )}

                {/* Table */}
                <div className="shadow-sm rounded-xl overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead className="bg-white text-gray-700 text-sm">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium">Name</th>
                                <th className="text-left py-3 px-4 font-medium">Vendors Count</th>
                                <th className="text-left py-3 px-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={3} className="py-6 px-4 text-center text-gray-500">
                                        {query ? `No results found for "${query}"` : "No categories found."}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((category, index) => (
                                    <tr
                                        key={category._id || index}
                                        className="border-t border-gray-200 hover:bg-gray-50 transition"
                                    >
                                        <td className="py-3 px-4 text-gray-800">{category.name}</td>
                                        <td className="py-3 px-4 text-gray-800">{category.vendorsCount}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    className="text-gray-600 hover:text-black"
                                                    title="Edit"
                                                    onClick={() => handleEditClick(category)}
                                                >
                                                    <FiEdit2 size={18} />
                                                </button>
                                                <button
                                                    className="text-gray-600 hover:text-black"
                                                    title="Delete"
                                                    onClick={() => deleteSeller(category._id)}
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
                            <button
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                            <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-3">
                                Edit Category
                            </h2>
                            <div className="mt-4">
                                <input
                                    type="text"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder="Category Name"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                            </div>
                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={handleUpdateCategory}
                                    className="px-6 py-2 bg-gray-100 border border-black text-black rounded-full text-sm font-medium hover:bg-gray-800 hover:text-white transition">
                                    Update Category
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ManageVendor;
