import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Layout, { Container } from "../components/layout";
import { DynamicLoader } from "../components/loader";
import BackHeader from "../components/backHeader";
import axios from "axios";
import { apiurl } from "../config/config";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    dayWiseSalesOrders = [],

    topCategories,
    topServices,
    topSubcategories,
    totalFemale,
    totalMale,
    totalUsers,
  } = analyticsData;

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "User Visits",
        data: [],
        fill: true,
        // tension: 0.2,
        tension: 0.5,
        backgroundColor: "rgba(153,102,255,0.2)",
        borderColor: "rgba(153,102,255,1)",
      },
    ],
  });
  const [yAxisMax, setYAxisMax] = useState(null);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiurl}/admin/analytics/dashboard`);

      console.log("/api/admin/analytics/", response.data);
      console.log("/api/admin/analytics/", response.data.data);
      if (response.data?.success === true) {
        setLoading(false);
        const analytics = response?.data?.data;
        setAnalyticsData(analytics);
        const priceCodeUserCount = analytics?.priceCodeUserCount || {};
        const labels = Object.keys(priceCodeUserCount);
        const dataValues = labels.map((label) => {
          const value = priceCodeUserCount[label];
          return typeof value === "string" ? parseInt(value) : value;
        });

        console.log("analyctics Chart Labels:", labels);
        console.log("analyctics Chart Values:", dataValues);

        const maxValue = Math.max(...dataValues);
        const yAxisMax = Math.ceil(maxValue + 1);

        setChartData({
          labels,
          datasets: [
            {
              label: "User Visits",
              data: dataValues,
              fill: true,
              tension: 0.5,
              backgroundColor: "rgba(153,102,255,0.2)",
              borderColor: "rgba(153,102,255,1)",
            },
          ],
        });
        setYAxisMax(yAxisMax);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const barOrderGraphData = {
    labels: dayWiseSalesOrders.map((item) => item?._id) || [],
    datasets: [
      {
        label: "Users",
        data: dayWiseSalesOrders?.map((item) => item?.totalOrders) || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgb(75, 192, 192)",
        fill: false,
        tension: 0.1,
      },
      // {
      //   label: "Revenue",
      //   data: analyticsData?.daily_orders?.map((item) => item.revenue) || [],
      //   backgroundColor: "rgba(153, 102, 255, 0.6)",
      // },
    ],
  };

  if (loading) {
    return (
      <Layout>
        <Container>
          <DynamicLoader maintext="wait" subtext="Loading Analytics.." />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-3">
        <BackHeader title="Analytics" />
      </div>
      <Container>
        <div className="h-full overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-2">Total Users</h2>
              <p className="text-lg font-semibold text-orange-600">
                {totalUsers}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-2">
                Total Search For Male
              </h2>
              <p className="text-lg font-semibold text-orange-600 flex items-center">
                {totalMale}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-2">
                Total Search For Female
              </h2>
              <p className="text-lg font-semibold text-orange-600 flex items-center">
                {totalFemale}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6  transition-shadow duration-300 ease-in-out">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Top Services
              </h2>
              <ul className="space-y-2">
                {topServices?.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-md font-medium text-gray-700">
                        {item?.service}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow p-6  transition-shadow duration-300 ease-in-out">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Top Categories
              </h2>
              <ul className="space-y-2">
                {topCategories?.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-md font-medium text-gray-700">
                        {item?.category}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow p-6  transition-shadow duration-300 ease-in-out">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Top Sub Categories
              </h2>
              <ul className="space-y-2">
                {topSubcategories?.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-md font-medium text-gray-700">
                        {item?.subCategory}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-2 w-full overflow-auto mx-auto mt-2.5 shadow  rounded-lg bg-white/100  p-3 py-6 mb-11">
            {/* <div className="bg-white rounded-lg shadow px-6 pt-2">
                <Line data={barOrderGraphData} />
              </div> */}
            <div
              className="min-w-[800px]"
              style={{ minWidth: `${chartData.labels.length * 30}px` }}
            >
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      ticks: {
                        autoSkip: false, // 🔥 disable skipping
                      },
                    },
                    y: {
                      beginAtZero: true,
                      max: yAxisMax || undefined, // fallback to auto if null
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
                height={400}
              />
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default Analytics;
