import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaBox,
  FaMapMarkerAlt,
  FaTruck,
  FaFileInvoice,
  FaCreditCard,
  FaRegCalendarAlt,
} from "react-icons/fa";
import Layout from "../components/layout";
import { DynamicLoader } from "../components/loader";
import BackHeader from "../components/backHeader";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiurl } from "../config/config";
import { getCookie } from "../config/webStorage";
import { jsPDF } from "jspdf";

const OrderDetails = () => {
  const { id } = useParams();
  const token = getCookie("zrotoken");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${apiurl}/admin/order/${id}`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (response.data.success && response.data.order.length > 0) {
        setOrder(response.data.order[0]);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const downloadInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Invoice for Order #${order.orderNumber}`, 20, 20);

    doc.setFontSize(12);
    doc.text(`Customer: ${order.shippingAddress.recipientName}`, 20, 40);
    doc.text(`Phone: ${order.shippingAddress.phone}`, 20, 50);
    doc.text(
      `Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.pincode}, ${order.shippingAddress.country}`,
      20,
      60,
      { maxWidth: 170 }
    );

    doc.text("Items:", 20, 80);
    order.items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} | Qty: ${item.qty} | Price: ₹${
          item.price
        } | Total: ₹${item.price * item.qty}`,
        25,
        90 + index * 10
      );
    });

    doc.text(
      `Total Amount: ₹${order.total}`,
      20,
      90 + order.items.length * 10 + 10
    );
    doc.text(
      "Thank you for your purchase!",
      20,
      90 + order.items.length * 10 + 20
    );

    doc.save(`Invoice_${order.orderNumber}.pdf`);
  };

  if (loading) return <DynamicLoader />;

  if (!order)
    return (
      <Layout>
        <BackHeader backButton={true} link="/orders" title="Back" />
        <p className="text-center mt-10 text-gray-500">No order found.</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <BackHeader backButton={true} link="/orders" title="Back" />

        <div className="mx-auto px-4 max-w-5xl">
          <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Order ID {order.orderNumber}
              </h1>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <FaRegCalendarAlt /> Ordered on{" "}
                {new Date(order.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <p className="text-gray-500 text-sm">Status: {order.status}</p>
            </div>
            <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => downloadInvoice(order)}
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <FaFileInvoice /> Download Invoice
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FaTruck className="text-orange-500" /> Shipping
              </h2>
              <p className="text-gray-700">{order.status}</p>
              {order.trackingNumber && (
                <p className="text-sm text-gray-500">
                  Tracking #: {order.trackingNumber}
                </p>
              )}
              {order.carrier && (
                <p className="text-sm text-gray-500">
                  Carrier: {order.carrier}
                </p>
              )}
            </div>

            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FaCreditCard className="text-orange-500" /> Payment
              </h2>
              <p className="text-gray-800 font-medium">{order.paymentStatus}</p>
              <p className="text-sm text-gray-500">{order.paymentMethod}</p>
              <p className="text-gray-800 font-semibold mt-2">
                Total: ₹{order.total}
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FaUser className="text-orange-500" /> Customer
              </h2>
              <p className="text-gray-800 font-medium">
                {order.shippingAddress.recipientName}
              </p>
              <p className="text-gray-500 text-sm">
                {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-500" /> Shipping Address
              </h2>
              <p className="text-gray-700">{order.shippingAddress.street}</p>
              <p className="text-gray-500 text-sm">
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p className="text-gray-500 text-sm">
                {order.shippingAddress.pincode}, {order.shippingAddress.country}
              </p>
            </div>

            {order.billingAddress && (
              <div className="bg-white shadow rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-orange-500" /> Billing Address
                </h2>
                <p className="text-gray-700">{order.billingAddress.street}</p>
                <p className="text-gray-500 text-sm">
                  {order.billingAddress.city}, {order.billingAddress.state}
                </p>
                <p className="text-gray-500 text-sm">
                  {order.billingAddress.pincode}, {order.billingAddress.country}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FaBox className="text-orange-500" /> Items Ordered
            </h2>
            <div className="divide-y">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.productId?.images?.[0] ||
                        "https://via.placeholder.com/80"
                      }
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover border"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                      <p className="text-sm text-gray-500">
                        Price: ₹{item.price}
                      </p>
                      <p className="text-sm text-gray-500">
                        Description: {item.productId?.description || "N/A"}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    ₹{item.price * item.qty}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-800">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-800">
                ₹{order.shippingCharges || 0}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-semibold text-gray-800 text-lg">Total</span>
              <span className="font-bold text-orange-600 text-lg">
                ₹{order.total}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;
