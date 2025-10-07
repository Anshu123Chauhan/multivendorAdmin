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
                      "Order Number",
                      "Products",
                      "Subtotal",
                      "Total",
                      "Payment Method",
                      "Payment Status",
                      "Shipping Method",
                      "Shipping Address",
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

                      <td className="px-4 py-3 truncate">
                        {order.orderNumber}
                      </td>

                      {/* Products */}
                      <td className="px-4 py-3">
                        <ul className="list-disc space-y-1">
                          {order.items.map((item, i) => (
                            <li key={i} className="truncate">
                              {item.name} × {item.qty} — ₹{item.price}
                            </li>
                          ))}
                        </ul>
                      </td>

                      <td className="px-4 py-3">₹{order.subtotal}</td>
                      <td className="px-4 py-3 font-semibold">
                        ₹{order.total}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {order.paymentMethod}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {order.paymentStatus}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {order.shippingMethod}
                      </td>

                      {/* Shipping Address */}
                      <td className="px-4 py-3 min-w-[220px]">
                        <div className="text-gray-800 text-sm">
                          <p className="font-medium">
                            {order.shippingAddress?.recipientName || "N/A"}
                          </p>
                          <p>{order.shippingAddress?.phone}</p>
                          <p className="text-xs">
                            {order.shippingAddress?.street},{" "}
                            {order.shippingAddress?.city},{" "}
                            {order.shippingAddress?.state} -{" "}
                            {order.shippingAddress?.pincode}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3 capitalize">{order.status}</td>
                      <td className="px-4 py-3">
                        <div>
                          <div>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <CiEdit
                            className="rounded-md text-green-400 cursor-pointer hover:bg-green-400 hover:text-white bg-green-50 border border-green-200 text-2xl p-1"
                            //   onClick={onEdit}
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
