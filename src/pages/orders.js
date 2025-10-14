import React, { useState, useEffect } from "react";
import Layout, { Container } from "../components/layout";
import BackHeader from "../components/backHeader";
import Input from "../components/inputContainer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiurl } from "../config/config";
import { DynamicLoader } from "../components/loader";
import { getCookie } from "../config/webStorage";
import Swal from "sweetalert2";
import { usePermission } from "../components/getPermission";
import ActionButton from "../components/actionBtn";
import { CiEdit } from "react-icons/ci";
import { AiOutlineEye } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const token = getCookie("zrotoken");
  const navigate = useNavigate();
  const { permission, userType } = usePermission();

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Fetch Orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiurl}/admin/order`, {
        headers: { Authorization: token, "Content-Type": "application/json" },
      });

      if (response.status === 200 && response.data?.success) {
        const data = response.data.orders || [];
        setOrders(data);
        setAllOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Order
  const deleteOrder = (id) => {
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
        handleDeleteOrder(id);
      }
    });
  };

  const handleDeleteOrder = async (id) => {
    try {
      const response = await axios.delete(`${apiurl}/admin/order/${id}`, {
        headers: { Authorization: token, "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        Swal.fire("Deleted!", "The order has been deleted.", "success");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // ✅ Search by Order Number, Product Names, Shipping Address
  const handleSearch = (value) => {
    const trimmed = value.trim().toLowerCase();
    setSearchInput(trimmed);

    if (!trimmed) {
      setOrders(allOrders);
      return;
    }

    const filtered = allOrders.filter((order) => {
      const orderNumberMatch = order.orderNumber
        ?.toLowerCase()
        .includes(trimmed);

      const productMatch = order.items?.some((item) =>
        item.name?.toLowerCase().includes(trimmed)
      );

      const shipping = order.shippingAddress || {};
      const shippingString = `${shipping.recipientName || ""} ${
        shipping.phone || ""
      } ${shipping.street || ""} ${shipping.city || ""} ${
        shipping.state || ""
      } ${shipping.pincode || ""}`.toLowerCase();

      const shippingMatch = shippingString.includes(trimmed);

      return orderNumberMatch || productMatch || shippingMatch;
    });

    setOrders(filtered);
  };

  return (
    <Layout>
      <Container>
        {loading && (
          <DynamicLoader maintext="Please wait" subtext="Fetching Order Data" />
        )}

        <div className="flex flex-wrap justify-between w-full">
          <div className="flex flex-col py-2 px-2 w-full">
            <BackHeader
              title="Orders"
              rightSide={
                <div className="flex gap-3 w-[450px]">
                  <Input.search
                    placeholder="Search by order, product, or shipping"
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              }
            />

            <div className="relative shadow-md sm:rounded-lg mt-5 overflow-auto h-[75vh]">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-20">
                  <tr>
                    {[
                      "SN.",
                      "Order Id",
                      "Total Itmes",
                      "Payment Method",
                      "Payment Status",
                      "Total Rs",
                      "Seller",
                      "Status",
                      "Created At",
                      "Action",
                    ].map((header, index) => (
                      <th key={index} className="px-4 py-3 whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="text-sm text-gray-700">
                  {orders.length === 0 && (
                    <tr>
                      <td
                        colSpan="13"
                        className="text-center py-6 text-gray-400 text-base"
                      >
                        No orders found
                      </td>
                    </tr>
                  )}

                  {orders.map((order, index) => (
                    <tr
                      key={order._id}
                      className="border-t hover:bg-gray-50 transition-all duration-300"
                    >
                      <td className="px-4 py-3">{index + 1}</td>

                      {/* Full Order ID */}

                      <td className="px-4 py-3 truncate">{order.orderId}</td>

                      {/* Products */}
                      <td className="px-4 py-3">{order.totalItems}</td>
                      <td className="px-4 py-3">{order.paymentMethod}</td>
                      <td className="px-4 py-3">{order.paymentStatus=="not_required"?"Pending":"Paid"}</td>
                      <td className="px-4 py-3 font-semibold">
                        ₹{order.total}
                      </td>
                       <td className="px-4 py-3 font-semibold">
                        {order.sellerName}
                      </td>

                      <td className="px-4 py-3 font-semibold capitalize">{order.orderStatus}</td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {new Date(order.date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {new Date(order.date).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <AiOutlineEye
                            className="rounded-md text-blue-400 cursor-pointer hover:bg-blue-400 hover:text-white bg-blue-50 border border-blue-200 text-2xl p-1"
                            onClick={() =>
                              navigate(`/order-details/${order.orderId}`)
                            }
                          />
                          <CiEdit
                            className="rounded-md text-green-400 cursor-pointer hover:bg-green-400 hover:text-white bg-green-50 border border-green-200 text-2xl p-1"
                              onClick={()=>
                              navigate(`/edit-order/${order.orderId}`)}
                          />
                          <MdDeleteForever
                            className="rounded-md text-red-400 cursor-pointer hover:bg-red-400 hover:text-white bg-red-50 border border-red-200 text-2xl p-1"
                            //   onClick={onDelete}
                          />
                        </div>
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

export default Orders;
