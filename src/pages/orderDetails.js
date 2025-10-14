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
    const pageWidth = doc.internal.pageSize.getWidth();

    // 🧾 Header
    doc.setFontSize(18);
    doc.text("INVOICE", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Order No : ${order.orderNumber}`, 20, 35);
    doc.text(
      `Date : ${new Date(order.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`,
      pageWidth - 20,
      35,
      { align: "right" }
    );

    // Customer Details
    doc.setFontSize(14);
    doc.setFont("bold");
    doc.text("Customer Details", 20, 50);
    doc.setFontSize(11);
    doc.text(`Name : ${order.shippingAddress.recipientName}`, 20, 58);
    doc.text(`Phone : ${order.shippingAddress.phone}`, 20, 65);
    doc.text(
      `Address : ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}, ${order.shippingAddress.country}`,
      20,
      72,
      { maxWidth: pageWidth - 40 }
    );

    // Items Table Header
    let startY = 90;
    doc.setFontSize(13);
    doc.setFont("bold");
    doc.text("Items Ordered", 20, startY);

    startY += 10;
    doc.setFontSize(11);
    doc.setFillColor(240, 240, 240);
    doc.rect(20, startY - 6, pageWidth - 40, 8, "F");

    const qtyX = pageWidth - 65;
    const priceX = pageWidth - 45;
    const totalX = pageWidth - 25;

    doc.text("S.No", 25, startY);
    doc.text("Item Name", 45, startY);
    doc.text("Qty", qtyX, startY, { align: "right" });
    doc.text("Price", priceX, startY, { align: "right" });
    doc.text("Total", totalX, startY, { align: "right" });

    // Items Table Body
    startY += 6;
    order.items.forEach((item, index) => {
      const y = startY + index * 8;
      doc.text(`${index + 1}`, 25, y);
      doc.text(item.name, 45, y, { maxWidth: 80 });

      doc.text(`${item.qty}`, qtyX, y, { align: "right" });
      doc.text(`Rs ${item.price}`, priceX, y, { align: "right" });
      doc.text(`Rs ${item.price * item.qty}`, totalX, y, { align: "right" });
    });

    // Totals Section
    const totalY = startY + order.items.length * 8 + 15;
    doc.setFontSize(12);

    doc.text("Subtotal:", priceX, totalY, { align: "right" });
    doc.text(`Rs ${order.subtotal || order.total}`, totalX, totalY, {
      align: "right",
    });

    doc.text("Shipping:", priceX, totalY + 8, { align: "right" });
    doc.text(`Rs ${order.shippingCharges || 0}`, totalX, totalY + 8, {
      align: "right",
    });

    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.text("Total:", priceX, totalY + 18, { align: "right" });
    doc.text(`Rs ${order.total}`, totalX, totalY + 18, { align: "right" });
    doc.setFont(undefined, "normal");

    // Footer
    doc.setFontSize(11);
    doc.text("Thank you for shopping with us!", pageWidth / 2, totalY + 40, {
      align: "center",
    });

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
              <p className="text-gray-500">Status: {order.status}</p>
              {order.trackingUrl && (
                <p className="text-sm text-gray-500">
                  Tracking URL: {order.trackingUrl}
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
              <p className="text-gray-800 font-medium">{order.paymentMethod=="cod"?"Pending":"Paid"}</p>
              <p className="text-sm text-gray-500">{order.paymentMethod=="cod"?"COD":order.paymentMethod}</p>
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
                      className="w-40 h-40 rounded-md shadow-xl object-cover border"
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
