import React, { useState, useEffect } from "react";
import Layout, { Container } from "../components/layout";
import BackHeader from "../components/backHeader";
import { LiveAnalytics } from "../services/analyticsService";

const LiveView = () => {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await LiveAnalytics();
        console.log("responseresponse", response);
        setLiveData(response?.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Container>
          <BackHeader title="Live View" />
          <div className="flex justify-center items-center h-full">
            <p className="text-xl font-semibold">Loading...</p>
          </div>
        </Container>
      </Layout>
    );
  }

  if (!liveData) {
    return (
      <Layout>
        <Container>
          <BackHeader title="Live View" />
          <div className="flex justify-center items-center h-full">
            <p className="text-xl font-semibold">No data available</p>
          </div>
        </Container>
      </Layout>
    );
  }

  const { totalStores, salesData } = liveData;

  return (
    <Layout>
      <Container>
        <BackHeader title="Live View" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
          {/* Total Stores */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800">Total Stores</h3>
            <p className="text-3xl font-semibold text-blue-600 mt-4">
              {totalStores}
            </p>
          </div>

          {/* Total Sales */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800">Total Sales</h3>
            <p className="text-3xl font-semibold text-green-600 mt-4">
              ₹{salesData.TotalSales.toLocaleString()}
            </p>
          </div>

          {/* Total Orders */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800">Total Orders</h3>
            <p className="text-3xl font-semibold text-indigo-600 mt-4">
              {salesData.TotalOrders}
            </p>
          </div>

          {/* Customers */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800">Customers</h3>
            <p className="text-3xl font-semibold text-yellow-600 mt-4">
              {salesData.Customers}
            </p>
          </div>

          {/* Active Carts */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800">Active Carts</h3>
            <p className="text-3xl font-semibold text-orange-600 mt-4">
              {salesData.ActiveCarts}
            </p>
          </div>

          {/* Checking Out */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800">Checking Out</h3>
            <p className="text-3xl font-semibold text-purple-600 mt-4">
              {salesData.CheckingOut}
            </p>
          </div>

          {/* Purchased */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800">Purchased</h3>
            <p className="text-3xl font-semibold text-red-600 mt-4">
              {salesData.Purchased}
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default LiveView;
