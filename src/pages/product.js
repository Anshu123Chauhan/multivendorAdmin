import React, { useState, useEffect } from "react";
import Layout, { Container } from "../components/layout";
import BackHeader from "../components/backHeader";
import Input from "../components/inputContainer";
import Card from "../components/card";
import { useUser } from "../config/userProvider";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { apiurl } from "../config/config";
import { DynamicLoader } from "../components/loader";
import { AiOutlineEye } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useStepContext } from "@mui/material";
import { getCookie } from "../config/webStorage";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { usePermission } from "../components/getPermission";
import ActionButton from "../components/actionBtn";

const Product = () => {
  const [productData, setproductData] = useState([]);

  const [allAdmin, setAllAdmin] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editToggle, setEditToggle] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newFilter, setNewFilter] = useState({
    name: "",
    status: "Active",
  });
  const [loading, setloading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const token = getCookie("zrotoken");
  const navigate = useNavigate();
  const {permission, userType}  = usePermission()
  

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    setloading(true);
    try {
      const response = await axios.get(`${apiurl}/admin/product`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      console.log(response)
      if (response.status === 200) {
        setproductData(response?.data?.data);
        setAllAdmin(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
    } finally {
      setloading(false);
    }
  };

  const toggleStatus = async (admin) => {
    const { id } = admin;

    try {
      const response = await axios.put(
        `${apiurl}/admin/auth/update`,
        {
          id: id,
          username: admin?.username,
          email: admin?.email,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.data;
      if (data.success) {
        fetchProduct();
      }
    } catch (error) {
      console.error("Error updating admin status:", error);
    }
  };

  const handleEditStatus = (id) => {
    navigate(`/editProduct/${id}`);
  };

  const deleteProduct = (id) => {
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
        handleDeleteProduct(id);
        Swal.fire("Deleted!", "The Product has been deleted.", "success");
      }
    });
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${apiurl}/admin/product/${id}`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      const data = await response.data;

      if (response.status===200) {
        // toast.success("Deleted Successfully");
        fetchProduct();
      }
    } catch (error) {
      console.error("Error updating filter:", error);
    }
  };

  const handleSearch = (value) => {
    const trimmedValue = value.trim();
    setSearchInput(trimmedValue);

    if (!trimmedValue) {
      setproductData(allAdmin);
      return;
    }

    console.log("trimmed value", trimmedValue);

    const updatedFilter = productData.filter((item) =>
      item?.name?.toLowerCase().includes(trimmedValue.toLowerCase())
    );

    setproductData(updatedFilter);
  };

  return (
    <Layout>
      <Container>
        {loading == true ? (
          <DynamicLoader maintext="wait" subtext="Fetching Product Data" />
        ) : null}
        <div className="flex flex-wrap justify-between w-full">
          <div className="flex flex-col  py-2 px-2 w-full">
            <BackHeader
              title="Products"
              rightSide={
                <div className="flex gap-3 w-[500px]">
                  <button
                    className="bg-[#000] hover:bg-[#e7c984] hover:text-[#000]  text-[#fff] w-[150px] p-2 rounded-md"
                    onClick={() => navigate("/addProduct")}
                  >
                    Add Product
                  </button>

                  <Input.search
                    placeholder="Search Product"
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              }
            />
            <div className="relative shadow-md sm:rounded-lg mt-5 overflow-auto h-[75vh]">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-20">
                  <tr>
                    {[
                      "SN.",
                      "Vendor",
                      "Image",
                      "Name",
                      "Category",
                      "SubCategory",
                      "Selling Price",  
                      "MRP",          
                      "Status",
                      "Action",
                    ].map((item, index) => (
                      <th key={index} scope="col" className="px-6 py-3">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {productData?.map((product, index) => (
                    <tr
                      key={product?._id}
                      className="border-t relative overflow-hidden group hover:bg-gray-50 transition-all duration-500"
                    >
                      <td className="relative px-6 py-3">{index + 1}</td>
                        <td className="relative px-6 py-3 capitalize">
                        {product?.seller?.fullName||"Admin"}
                        </td>
                        <td className="relative px-6 py-3 capitalize">
                        <img src={product?.images[0]} className="w-20 h-20"/>
                      </td>
                      <td className="relative px-6 py-3 capitalize">
                        {product?.name}
                      </td>
                      <td className="relative px-6 py-3 capitalize">
                        {product?.category?.name}
                      </td>
                      <td className="relative px-6 py-3 capitalize">
                        {product?.subCategory?.name|| "N/A"}
                      </td>
                      <td className="relative px-6 py-3">{product?.sellingPrice}</td>
                      <td className="relative px-6 py-3">{product?.mrp}</td>
                      <td className="relative px-6 py-3">
                        {product?.status === "active" ? "Active" : "Draft"}
                      </td>
                      <td className="relative px-4">
                        {/* <span className="flex gap-1 cursor-pointer">
                          <CiEdit
                            className="p-1 text-2xl rounded-md text-green-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200 ml-1"
                            onClick={() => handleEditStatus(product?._id)}
                          />
                          <MdDeleteForever
                            className="p-1 text-2xl rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200 ml-1"
                            onClick={() => deleteProduct(product?._id)}
                          />
                        </span> */}
                        <span className="flex gap-1 cursor-pointer">
                         <ActionButton
                            item={product}
                            tabName="Product"
                            permission={permission} 
                            userType={userType}
                            onView={()=>navigate(`/products/${product?._id}`)}
                            onEdit={() => navigate(`/editProduct/${product?._id}`)}
                            onDelete={() => deleteProduct(product?._id)}
                            />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default Product;
