import React, { useState, useEffect,useMemo } from "react";
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
import { getCookie } from "../config/webStorage";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

const Customer = () => {
  const [customerData, setcustomerData] = useState([]);

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
   const decodedToken = useMemo(() => {
        if (!token) return null;
        try {
          return jwtDecode(token);
        } catch (error) {
          console.error("Invalid token:", error);
          return null;
        }
      }, [token]);
  const navigate = useNavigate();



  const fetchcustomer = async () => {
    setloading(true);
    try {
      const response = await axios.get(`${apiurl}/admin/customer-List`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (response.data.success === true) {
        setcustomerData(response?.data?.sellerList);
        setAllAdmin(response?.data?.sellerList);
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
        fetchcustomer();
      }
    } catch (error) {
      console.error("Error updating admin status:", error);
    }
  };

  const handleViewStatus = (id) => {
    navigate(`/customers/${id}`);
  };

  const deletecustomer = (id) => {
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
        handleDeletecustomer(id);
        Swal.fire("Deleted!", "The admin has been deleted.", "success");
      }
    });
  };

  const handleDeletecustomer = async (id) => {
    try {
      const response = await axios.delete(`${apiurl}/customer/delete/${id}`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      const data = await response.data;

      if (data.success) {
        toast.success("Deleted Successfully");
        fetchcustomer();
      }
    } catch (error) {
      console.error("Error updating filter:", error);
    }
  };

  const handleSearch = (value) => {
    const trimmedValue = value.trim();
    setSearchInput(trimmedValue);

    if (!trimmedValue) {
      setcustomerData(allAdmin);
      return;
    }

    console.log("trimmed value", trimmedValue);

    const updatedFilter = customerData.filter((item) =>
      item?.fullName?.toLowerCase().includes(trimmedValue.toLowerCase())
    );

    setcustomerData(updatedFilter);
  };
   useEffect(() => {
    // console.log("storeId", id);
  
    if (decodedToken?.userType === "Admin") {
      fetchcustomer();
    }
  }, [decodedToken]); 
  

  return (
    <Layout>
      <Container>
        {loading == true ? (
          <DynamicLoader maintext="wait" subtext="Fetching customer Data" />
        ) : null}
        <div className="flex flex-wrap justify-between w-full">
          <div className="flex flex-col  py-2 px-2 w-full">
            <BackHeader
              title="customers"
              rightSide={
                <div className="flex gap-3 w-[500px]">
                  {/* <button
                    className="bg-[#000] hover:bg-[#e7c984] hover:text-[#000]  text-[#fff] w-[150px] p-2 rounded-md"
                    onClick={() => navigate("/addcustomer")}
                  >
                    Add customer
                  </button> */}

                  <Input.search
                    placeholder="Search customer"
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
                      "Name",
                      "Address",
                      "Phone no.",
                      "Email",
                      "Action",
                    ].map((item, index) => (
                      <th key={index} scope="col" className="px-6 py-3">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {customerData?.map((customer, index) => (
                    <tr
                      key={customer?.id}
                      className="border-t relative overflow-hidden group hover:bg-gray-50 transition-all duration-500"
                    >
                      <td className="relative px-6 py-3">{index + 1}</td>
                      <td className="relative px-6 py-3 capitalize">
                        {customer?.name}
                      </td>
                      <td className="relative px-6 py-3">
                        {customer?.address||"N/A"}
                      </td>
                      <td className="relative px-6 py-3">{customer?.phone}</td>
                      <td className="relative px-6 py-3">{customer?.email}</td>
                      {/* <td className="relative px-6 py-3">
                        {customer?.isActive === true ? "Approved" : "Pending"}
                      </td> */}
                      <td className="relative px-4">
                        <span className="flex gap-1 cursor-pointer">
                          <AiOutlineEye
                            className="p-1 text-2xl rounded-md text-green-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200 ml-1"
                            onClick={() => handleViewStatus(customer?._id)}
                          />
                          {/* <MdDeleteForever
                            className="p-1 text-2xl rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200 ml-1"
                            onClick={() => deletecustomer(customer?._id)}
                          /> */}
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

export default Customer;
