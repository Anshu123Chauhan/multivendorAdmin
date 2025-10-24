import React, { useEffect, useState } from "react";
import Layout from "../components/layout.js";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { GoDot } from "react-icons/go";
import { useUser } from "../config/userProvider.js";
import axios from "axios";
import { getCookie } from "../config/webStorage.js";
import { apiurl } from "../config/config.js";

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { userData, permissions } = useUser();
  const token = getCookie("zrotoken");
  const [searchInput, setSearchInput] = useState("");
  const [userCount, setUserCount] = useState(null);
  const [data, setData] = useState("");
  const [analyticsData, setAnalyticsData] = useState("");
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const PieData = {
    labels: ["Active User", "Total Users"],
    datasets: [
      {
        label: "user data",
        data: [userCount?.ActiveUserCount, userCount?.TotalUserCount],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        hoverOffset: 2,
      },
    ],
  };

  return (
    <Layout>
      <div className="relative overflow-y-scroll h-full">
        <div className="flex flex-col items-start justify-between gap-1 w-full sm:p-0 p-2 rounded-lg">
          <div className="w-full">
            <div className="flex w-full">
              <Dashboard1
                PieData={PieData}
                permissions={permissions}
                analyticsData={analyticsData}
                userData={userData}
                userCount={userCount}
                data={data}
                setData={setData}
                token={token}
              />
            </div>
          </div>
        </div>
      </div>

      {isOpenSearch && (
        <div className="w-full md:w-2/3 h-[80%] shadow z-30 top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%] pb-2 bg-white/100 absolute rounded-xl flex flex-col gap-3 overflow-hidden">
          <div className="flex w-full items-center justify-between gap-5 px-4 md:px-10 mt-3">
            <div className="flex items-center py-1 px-2 rounded-xl w-full bg-white/100 border">
              <FiSearch />
              <input
                type="text"
                placeholder="search here..."
                className="outline-none w-full px-2"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div
              className="border p-1 rounded-lg cursor-pointer"
              onClick={() => setIsOpenSearch(false)}
            >
              <IoClose />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;

const Dashboard1 = ({
  PieData,
  permissions,
  analyticsData,
  userData,
  userCount,
  token,
  setData,
  data,
}) => {
  const [getAnalyticsData, setGetAnalyticsData] = useState({});
  const [yAxisMax, setYAxisMax] = useState(null);
  const [selletData, setsellerData] = useState([]);
  const [selectSellerId, setSelectSellerId] = useState();

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "User Visits",
        data: [],
        fill: true,
        tension: 0.5,
        backgroundColor: "rgba(153,102,255,0.2)",
        borderColor: "rgba(153,102,255,1)",
      },
    ],
  });

  const axiosConfig = {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  };

  const orderAnalyticsData = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/admin/orders-analytics/${selectSellerId || ""}`,
        axiosConfig
      );
      if (response.data?.success) {
        const analytics = response.data.data;
        setGetAnalyticsData(analytics);

        const priceCodeUserCount = analytics?.today?.priceCodeUserCount || {};
        const labels = Object.keys(priceCodeUserCount);
        const dataValues = labels.map((label) => {
          const value = priceCodeUserCount[label];
          return typeof value === "string" ? parseInt(value) : value;
        });
        const maxValue = Math.max(...dataValues);
        setYAxisMax(Math.ceil(maxValue + 1));

        setChartData({
          labels,
          datasets: [
            {
              label: "Today User Visits",
              data: dataValues,
              fill: true,
              tension: 0.5,
              backgroundColor: "rgba(153,102,255,0.2)",
              borderColor: "rgba(153,102,255,1)",
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard analytics data:", error);
    }
  };

  const ordertrackingData = async () => {
    try {
      const response = await axios.get(
        `${apiurl}/admin/orders-tracking-analytics?id=${selectSellerId || ""}`,
        axiosConfig
      );
      if (response.data?.success) {
        setGetAnalyticsData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tracking analytics:", error);
    }
  };

  useEffect(() => {
    orderAnalyticsData();
    ordertrackingData();
  }, [selectSellerId]);

  const fetchSeller = async () => {
    try {
      const response = await axios.get(`${apiurl}/admin/seller-List`, axiosConfig);
      if (response.data.success) setsellerData(response.data.sellerList);
    } catch (error) {
      console.error("Error fetching seller list:", error);
    }
  };

  useEffect(() => {
    fetchSeller();
  }, []);

  const { totalFemale = 0, totalMale = 0, totalUsers = 0 } =
    getAnalyticsData?.today || {};

  return (
    <div className="w-full">
      <div className="flex flex-col items-start md:flex-row w-full gap-2">
        <div className="w-full md:w-1/3 flex flex-col gap-2">
          <div className="bg-white rounded-lg shadow p-4 md:p-6 ">
            <h2 className="text-lg md:text-2xl font-semibold">Analytics</h2>
            <div className="mt-6 flex flex-col gap-4 ">
              <StatCard label="Total Users" value={totalUsers} color="#E9CFFC" />
              <StatCard label="Total Search For Category" value={totalMale} color="#f4eeee" />
              <StatCard label="Total Search For Product" value={totalFemale} color="#D0C2E3" />
            </div>
          </div>
        </div>

        <select
          className="border rounded px-2 py-1"
          value={selectSellerId || ""}
          onChange={(e) => setSelectSellerId(e.target.value)}
        >
          <option value="">Select Seller</option>
          {selletData.map((seller) => (
            <option key={seller._id} value={seller._id}>
              {seller.fullName}
            </option>
          ))}
        </select>

        <div className="w-full md:w-2/3 flex flex-col gap-2">
          <div className="flex flex-col bg-white rounded-lg shadow p-4 md:p-6">
            <AnalyticsDashboard data={data} />
          </div>

          <div className="shadow rounded-lg w-full bg-white/100 p-3 py-6">
            <Line
              data={chartData}
              options={{
                responsive: true,
                scales: {
                  y: { beginAtZero: true, max: yAxisMax || undefined, ticks: { stepSize: 1 } },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="text-center w-full border rounded-xl flex justify-between items-center px-3 py-3">
    <p className="text-sm md:text-base font-semibold flex items-center gap-2 capitalize">
      <GoDot /> {label}
    </p>
    <p className="font-semibold text-gray-800 px-5 rounded-full text-xs md:text-sm" style={{ backgroundColor: color }}>
      {value}
    </p>
  </div>
);

const StoreDetails = ({ title, value, bgColor, textColor, className }) => (
  <div className={`${className} ${bgColor} flex flex-col w-full py-3 pb-10 h-20 md:h-24 lg:h-32 max-h-28 rounded-lg relative`}>
    <div className="flex justify-end">
      <div className={`bg-white font-semibold p-2 px-4 rounded-md rounded-r-none uppercase ${textColor || ""}`}>
        {title}
      </div>
    </div>
    <div className="max-[1000px]:text-lg min-[1000px]:text-2xl max-[1400px]:text-2xl min-[1400px]:text-4xl font-bold text-white pl-3 pb-3">
      {value}
    </div>
  </div>
);

const AnalyticsDashboard = ({ data }) => (
  <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
    <StoreDetails title="Sellers" value={data?.sellerCount || "00"} bgColor="bg-[#fcafaf]" textColor="text-red-500" />
    <StoreDetails title="Categories" value={data?.categoryCount || "00"} bgColor="bg-[#e4cbfe]" textColor="text-purple-500" />
    <StoreDetails title="Customers" value={data?.customerCount || "00"} bgColor="bg-[#fed7ab]" textColor="text-orange-500" />
    <StoreDetails title="Products" value={data?.productCount || "00"} bgColor="bg-[#fde592]" textColor="text-amber-500" />
  </div>
);
