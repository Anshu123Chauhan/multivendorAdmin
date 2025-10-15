import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBox,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCreditCard,
  FaRupeeSign,
  FaRegStickyNote,
} from "react-icons/fa";
import Layout from "../components/layout";
import { useParams } from "react-router-dom";
import { getCookie } from "../config/webStorage";
import axios from "axios";
import { apiurl } from "../config/config";
import BackHeader from "../components/backHeader";

const CustomerDetails = () => {
  const { id } = useParams();
  const token = getCookie("zrotoken");

  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      case "placed":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`${apiurl}/admin/customer-get/${id}`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setCustomer(response.data.customer);
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  if (!customer) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading customer details...
        </div>
      </Layout>
    );
  }

  const customerAddress =
    customer?.addresses?.length > 0
      ? `${customer.addresses[0].address}, ${customer.addresses[0].city}, ${customer.addresses[0].state}`
      : "N/A";

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "delivered").length;
  const pendingOrders = totalOrders-completedOrders;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 px-4 py-8 flex flex-col items-center">
        <BackHeader backButton={true} link="/customer" title="Back" />
        <div className="w-full max-w-6xl text-center mb-8 transition-all">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Customer Details
          </h1>
          <p className="text-gray-500 mt-1">
            Detailed customer profile & order information
          </p>
        </div>

        <div className="w-full max-w-6xl bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 mb-6 transition hover:shadow-xl hover:scale-[1.01]">
          <div className="text-7xl text-gray-400">
            <FaUserCircle />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-800">
              {customer.name}
            </h2>
            <p className="text-gray-500">{customer.email}</p>
            <p className="text-xs text-gray-500">
              Joined: {new Date(customer.createdAt).toLocaleDateString()}
            </p>
            <span
              className={`inline-block mt-2 px-3 py-1 text-sm rounded-xl transition bg-green-100 text-green-700`}
            >
              Active
            </span>
          </div>
        </div>

        <div className="w-full max-w-6xl bg-white shadow-lg rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 transition hover:shadow-xl hover:scale-[1.01]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
              <FaPhoneAlt />
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-800">{customer.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
              <FaEnvelope />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{customer.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1">
            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
              <FaMapMarkerAlt />
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium text-gray-800">{customerAddress}</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 hover:shadow-xl hover:scale-[1.01]">
            <FaBox className="text-blue-600 text-2xl" />
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-lg font-semibold">{totalOrders}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 transition hover:shadow-xl hover:scale-[1.01]">
            <FaClock className="text-yellow-600 text-2xl" />
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-lg font-semibold">{pendingOrders}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 transition hover:shadow-xl hover:scale-[1.01]">
            <FaCheckCircle className="text-green-600 text-2xl" />
            <div>
              <p className="text-gray-500 text-sm">Delivered</p>
              <p className="text-lg font-semibold">{completedOrders}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 transition hover:shadow-xl hover:scale-[1.01]">
            <FaTimesCircle className="text-red-600 text-2xl" />
            <div>
              <p className="text-gray-500 text-sm">Cancelled</p>
              <p className="text-lg font-semibold">{cancelledOrders}</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6 overflow-x-auto hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-4">Order History</h3>
          <table className="w-full min-w-[650px] text-left border-collapse">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2 px-3">Order Number</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Total</th>
                <th className="py-2 px-3">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b last:border-0 hover:bg-gray-50 transition"
                  >
                    <td className="py-2 px-3 font-medium">
                      {order.orderNumber}
                    </td>
                    <td className="py-2 px-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-1 text-sm rounded-lg ${statusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-semibold">
                      ₹{order.total.toLocaleString()}
                    </td>
                    <td className="py-2 px-3">
                      {order.items.map((item) => item.name).join(", ")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-4 text-center text-gray-500 italic"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerDetails;
