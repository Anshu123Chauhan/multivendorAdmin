import React, { useEffect, useState } from "react";
import Layout from "../components/layout.js";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { apiurl } from "../config/config";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { getCookie } from "../config/webStorage.js";
import BackHeader from "../components/backHeader.js";

const SellerDetails = () => {
  const [seller, setSeller] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("last7days");
  const { id } = useParams();
  const token = getCookie("zrotoken");

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await axios.get(`${apiurl}/seller/get/${id}`, {
          headers: { Authorization: token },
        });
        if (res.data.success === true) setSeller(res.data.seller);
      } catch (error) {
        console.error("Error fetching seller:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSeller();
  }, [id, token]);

  useEffect(() => {
    if (!seller) return;

    const generateAnalytics = () => {
      const totalOrders = Math.floor(Math.random() * 500 + 500);
      const totalRevenue = totalOrders * Math.floor(Math.random() * 500 + 200);
      const avgOrderValue = Math.floor(totalRevenue / totalOrders);
      const conversionRate = Math.floor(Math.random() * 30 + 20); // %
      const monthlySales = [
        { month: "Jan", sales: Math.floor(Math.random() * 70000) },
        { month: "Feb", sales: Math.floor(Math.random() * 70000) },
        { month: "Mar", sales: Math.floor(Math.random() * 70000) },
        { month: "Apr", sales: Math.floor(Math.random() * 70000) },
        { month: "May", sales: Math.floor(Math.random() * 70000) },
        { month: "Jun", sales: Math.floor(Math.random() * 70000) },
      ];
      const productCategoryShare = [
        { name: "Clothing", value: 45 },
        { name: "Electronics", value: 25 },
        { name: "Home Decor", value: 15 },
        { name: "Accessories", value: 15 },
      ];
      const topProducts = [
        { name: "Kurti Set", orders: 250 },
        { name: "Bluetooth Earbuds", orders: 180 },
        { name: "Wall Decor", orders: 120 },
        { name: "Handbag", orders: 100 },
      ];
      const ordersByPayment = [
        { name: "Cash", value: 45 },
        { name: "Card", value: 35 },
        { name: "Online Wallet", value: 20 },
      ];
      const customerType = [
        { name: "New", value: 60 },
        { name: "Returning", value: 40 },
      ];
      const customerGrowth = [
        { date: "01 Sep", customers: 5 },
        { date: "05 Sep", customers: 8 },
        { date: "10 Sep", customers: 12 },
        { date: "15 Sep", customers: 10 },
        { date: "20 Sep", customers: 15 },
        { date: "25 Sep", customers: 20 },
      ];

      setAnalytics({
        totalOrders,
        totalRevenue,
        avgOrderValue,
        conversionRate,
        monthlySales,
        productCategoryShare,
        topProducts,
        ordersByPayment,
        customerType,
        customerGrowth,
      });
    };

    generateAnalytics();
  }, [seller, dateRange]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-medium">Loading seller details...</p>
        </div>
      </Layout>
    );
  }

  if (!seller) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-medium text-red-500">
            Seller details not found
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 p-4 ">
        <div className="mb-4">
          <BackHeader
            title="Seller Details"
            backButton={true}
            link="/sellerList"
          />
        </div>
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-row md:flex-row items-center gap-6 border-b pb-6">
            <img
              src={seller.addressProof}
              alt={seller.fullName}
              className="w-32 h-32 rounded-lg object-cover border"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {seller.fullName}
              </h1>
              <p className="text-gray-600">{seller.businessName}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 text-sm rounded-lg ${
                  seller.isActive
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {seller.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard title="Email" value={seller.email} />
            <InfoCard title="Phone" value={seller.phone} />
            <InfoCard title="Business Address" value={seller.businessAddress} />
            <InfoCard title="GST Number" value={seller.gstNumber} />
            <InfoCard
              title="Identity Proof"
              value={`${seller.identityProof} - ${seller.identityProofNumber}`}
            />
            <InfoCard title="Commission (%)" value={seller.commission} />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Bank Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard title="Account Holder" value={seller.accountHolder} />
              <InfoCard title="Bank Account" value={seller.bankAccount} />
              <InfoCard title="IFSC Code" value={seller.ifscCode} />
            </div>
          </div>

          {analytics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10"
            >
              <div className="flex justify-between items-center mb-4 ">
                <h2 className="text-2xl font-bold text-gray-800">
                  Seller Analytics
                </h2>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="border rounded-lg px-3 py-1 w-64 shadow-lg"
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="thisMonth">This Month</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AnalyticsCard
                  title="Total Orders"
                  value={analytics.totalOrders}
                />
                <AnalyticsCard
                  title="Total Revenue"
                  value={`₹${analytics.totalRevenue.toLocaleString()}`}
                />
                <AnalyticsCard
                  title="Avg Order Value"
                  value={`₹${analytics.avgOrderValue}`}
                />
                <AnalyticsCard
                  title="Conversion Rate"
                  value={`${analytics.conversionRate}%`}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Monthly Sales (₹)
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analytics.monthlySales}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="sales"
                        fill="#4f46e5"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Category Share (%)
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={analytics.productCategoryShare}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {analytics.productCategoryShare.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"][
                                index % 4
                              ]
                            }
                          />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-10 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Customer Growth Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={analytics.customerGrowth}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="customers"
                        stroke="#4f46e5"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-10 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Orders by Payment Type (%)
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={analytics.ordersByPayment}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {analytics.ordersByPayment.map((entry, index) => (
                          <Cell
                            key={`cell-pay-${index}`}
                            fill={["#6366f1", "#22c55e", "#f59e0b"][index % 3]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-10 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-4 ">Top Products</h3>
                <ul className="space-y-2">
                  {analytics.topProducts.map((prod, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between border-b pb-2 last:border-0"
                    >
                      <span className="text-gray-700">{prod.name}</span>
                      <span className="font-semibold">
                        {prod.orders} Orders
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SellerDetails;

const InfoCard = ({ title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gray-50 p-4 rounded-lg shadow-lg"
  >
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="mt-1 text-gray-800 font-semibold break-words">{value}</p>
  </motion.div>
);

const AnalyticsCard = ({ title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-indigo-50 p-4 rounded-lg text-center shadow-lg hover:shadow-xl transition-shadow"
  >
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="mt-2 text-xl font-bold text-indigo-700">{value}</p>
  </motion.div>
);
