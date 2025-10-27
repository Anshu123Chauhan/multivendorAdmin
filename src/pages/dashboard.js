import { useEffect, useState, useCallback, useMemo } from "react";
import Layout from "../components/layout.js";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { GoDot } from "react-icons/go";
import { useUser } from "../config/userProvider.js";
import axios from "axios";
import { getCookie } from "../config/webStorage.js";
import { apiurl } from "../config/config.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { userData, permissions } = useUser();
  const token = getCookie("zrotoken");
  const [searchInput, setSearchInput] = useState("");
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="relative">
          {!isOpenSearch ? (
            <div onClick={() => setIsOpenSearch(true)}>
              <FiSearch />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="border rounded px-2 py-1"
                placeholder="Search..."
              />
              <div onClick={() => setIsOpenSearch(false)}>
                <IoClose />
              </div>
            </div>
          )}
        </div>
      </div>
      <Dashboard1 permissions={permissions} userData={userData} token={token} />
    </Layout>
  );
};

export default Dashboard;

const Dashboard1 = ({ permissions, userData, token }) => {
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderTrackingCounts, setOrderTrackingCounts] = useState({
    delivered: 0,
    canceled: 0,
    pending: 0,
    totalOrders: 0
  });
  const [getAnalyticsData, setGetAnalyticsData] = useState({});
  const [selletData, setsellerData] = useState([]);
  const [selectSellerId, setSelectSellerId] = useState("");
  const [data, setData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    return first.toISOString().slice(0, 10); 
  });

  const monthOptions = useMemo(() => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      options.push({
        value: d.toISOString().slice(0, 10),
        label: d.toLocaleString(undefined, { month: 'short', year: 'numeric' }),
      });
    }
    return options;
  }, []);
  
  const chartData = useMemo(() => {
    if (!orderData?.orders || orderData.orders.length === 0) return null;
    
    const sortedOrders = [...orderData.orders].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sortedOrders.map(order => {
      const date = new Date(order.date);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    });
    const counts = sortedOrders.map(order => order.count);
    
    return {
      labels,
      datasets: [{
        label: selectSellerId
          ? `Orders for ${selletData.find(s => s._id === selectSellerId)?.fullName || 'Selected Seller'}`
          : 'Total Orders',
        data: counts,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.2
      }]
    };
  }, [orderData, selectSellerId, selletData]);

  const axiosConfig = useMemo(() => ({
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  }), [token]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const dynamicParams = selectSellerId ? `?sellerId=${selectSellerId}` : '';
      const response = await axios.get(
        `${apiurl}/admin/analytics${dynamicParams}`,
        axiosConfig
      );
      if (response.data?.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [selectSellerId, axiosConfig, setData]);

  const fetchOrderAnalytics = useCallback(async (sellerIdParam, monthParam) => {
    setIsLoading(true);
    setError(null);
    try {
      const useSellerId = sellerIdParam !== undefined ? sellerIdParam : selectSellerId;
      const useMonth = monthParam !== undefined ? monthParam : selectedMonth;
      const params = [];
      if (useSellerId) params.push(`sellerId=${useSellerId}`);
      if (useMonth) params.push(`currentMonth=${useMonth}`);
      const dynamicParams = params.length ? `?${params.join('&')}` : '';
      const response = await axios.get(
        `${apiurl}/admin/orders-analytics${dynamicParams}`,
        axiosConfig
      );
      if (response.data?.success && response.data.orders) {
        setOrderData(response.data);
      } else {
        setOrderData(null);
        setError(response.data?.message || 'Failed to fetch order analytics');
      }
    } catch (error) {
      console.error("Error fetching order analytics:", error);
      setOrderData(null);
      setError(error.message || 'Failed to fetch order analytics');
    } finally {
      setIsLoading(false);
    }
  }, [selectSellerId, selectedMonth, axiosConfig]);

  const ordertrackingData = useCallback(async (sellerIdParam, monthParam) => {
    try {
      const useSellerId = sellerIdParam !== undefined ? sellerIdParam : selectSellerId;
      const useMonth = monthParam !== undefined ? monthParam : selectedMonth;
      const params = [];
      if (useSellerId) params.push(`sellerId=${useSellerId}`);
      if (useMonth) params.push(`currentMonth=${useMonth}`);
      const dynamicParams = params.length ? `?${params.join('&')}` : '';
      const response = await axios.get(
        `${apiurl}/admin/order-tracking-analytics${dynamicParams}`,
        axiosConfig
      );
      if (response.data?.success) {
        const { totalOrders, delivered, canceled, pending } = response.data;
        setGetAnalyticsData(prev => ({
          ...prev,
          orderTracking: {
            totalOrders,
            delivered,
            canceled,
            pending
          }
        }));
        setOrderTrackingCounts({ delivered: delivered || 0, canceled: canceled || 0, pending: pending || 0, totalOrders: totalOrders || 0 });
      }
    } catch (error) {
      console.error("Error fetching tracking analytics:", error);
    }
  }, [selectSellerId, selectedMonth, axiosConfig, setGetAnalyticsData]);

  useEffect(() => {
    ordertrackingData(selectSellerId, selectedMonth);
    fetchDashboardData();
    fetchOrderAnalytics(selectSellerId, selectedMonth);
  }, [selectSellerId, selectedMonth, ordertrackingData, fetchDashboardData, fetchOrderAnalytics]);

  const fetchSeller = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/admin/seller-List`, axiosConfig);
      if (response.data.success) setsellerData(response.data.sellerList);
    } catch (error) {
      console.error("Error fetching seller list:", error);
    }
  }, [axiosConfig]);

  useEffect(() => {
    fetchSeller();
  }, [fetchSeller]);

  const { totalFemale = 0, totalMale = 0, totalUsers = 0 } =
    getAnalyticsData?.today || {};

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col md:flex-row w-full gap-4">
        {/* Left column: Analytics */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-2xl font-semibold">Analytics</h2>
            <div className="mt-6 flex flex-col gap-4">
              <StatCard label="Total Users" value={totalUsers} color="#E9CFFC" />
              <StatCard label="Total Search For Category" value={totalMale} color="#f4eeee" />
              <StatCard label="Total Search For Product" value={totalFemale} color="#D0C2E3" />
            </div>
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <div className="flex flex-col bg-white rounded-lg shadow p-4 md:p-6 h-full">
            <AnalyticsDashboard data={data} />
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-lg shadow p-4 md:p-6">
        <div className="flex flex-row items-center justify-between w-full">
          <h2 className="text-lg md:text-2xl font-semibold">
            {selectSellerId 
              ? `${selletData.find(s => s._id === selectSellerId)?.fullName || ''}'s Orders`
              : 'All Orders'}
          </h2>
          <div className="flex flex-row items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium whitespace-nowrap">Seller:</label>
                <select
                  className="border rounded px-3 py-2 text-sm bg-white shadow-sm w-[200px]"
                  value={selectSellerId || ""}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setSelectSellerId(newId);
                    fetchOrderAnalytics(newId, selectedMonth);
                    ordertrackingData(newId, selectedMonth);
                    fetchDashboardData();
                  }}
                >
                  <option value="">All Sellers</option>
                  {selletData.map((seller) => (
                    <option key={seller._id} value={seller._id}>
                      {seller.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium whitespace-nowrap">Month:</label>
                <select
                  className="border rounded px-3 py-2 text-sm bg-white shadow-sm w-[150px]"
                  value={selectedMonth}
                  onChange={(e) => {
                    const newMonth = e.target.value;
                    setSelectedMonth(newMonth);
                    fetchOrderAnalytics(selectSellerId, newMonth);
                    ordertrackingData(selectSellerId, newMonth);
                    fetchDashboardData();
                  }}
                >
                  {monthOptions.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-4">
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-2xl font-semibold mb-4">Order Tracking</h2>
            <div className="mt-6 flex flex-col gap-4">
              <div className="w-full flex items-center justify-center mt-2">
                <div className="w-68 h-68">
                  <Pie
                    data={{
                      labels: ['Delivered', 'Pending', 'Canceled', 'Other'],
                      datasets: [
                        {
                          data: [
                            orderTrackingCounts.delivered || getAnalyticsData?.orderTracking?.delivered || 0,
                            orderTrackingCounts.pending || getAnalyticsData?.orderTracking?.pending || 0,
                            orderTrackingCounts.canceled || getAnalyticsData?.orderTracking?.canceled || 0,
                            (orderTrackingCounts.totalOrders || getAnalyticsData?.orderTracking?.totalOrders || 0) - ((orderTrackingCounts.delivered || getAnalyticsData?.orderTracking?.delivered || 0) + (orderTrackingCounts.pending || getAnalyticsData?.orderTracking?.pending || 0) + (orderTrackingCounts.canceled || getAnalyticsData?.orderTracking?.canceled || 0))
                          ],
                          backgroundColor: ['#4CAF50', '#FFA726', '#EF5350', '#9E9E9E'],
                          hoverOffset: 6
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'bottom' },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const value = context.raw;
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = ((value / total) * 100).toFixed(1);
                              return `${context.label}: ${value} (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <StatCard label="Total Orders" value={getAnalyticsData?.orderTracking?.totalOrders || orderTrackingCounts.totalOrders || 0} color="#FFE5E5" />
              <StatCard label="Delivered Orders" value={getAnalyticsData?.orderTracking?.delivered || orderTrackingCounts.delivered || 0} color="#E5FFE5" />
              <StatCard label="Pending Orders" value={getAnalyticsData?.orderTracking?.pending || orderTrackingCounts.pending || 0} color="#FFE5CC" />
              <StatCard label="Canceled Orders" value={getAnalyticsData?.orderTracking?.canceled || orderTrackingCounts.canceled || 0} color="#FFD5D5" />
            </div>
          </div>
        </div>
        {/* Right column: Timeline */}
        <div className="w-full md:w-2/3">
          <div className="shadow rounded-lg w-full bg-white/100 p-4 md:p-6 h-full">
            <h2 className="text-lg md:text-2xl font-semibold mb-4">
              Order Timeline (Last 30 Days)
            </h2>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64 text-red-500">
                {error}
              </div>
            ) : (
              <Line
                data={chartData || {
                  labels: [],
                  datasets: [{
                    label: 'Orders per Day',
                    data: [],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.2
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    },
                    title: {
                      display: true,
                      text: 'Daily Order Count'
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const value = context.parsed.y;
                          return `${value} order${value !== 1 ? 's' : ''}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { 
                        stepSize: 1,
                        precision: 0
                      },
                      title: {
                        display: true,
                        text: 'Number of Orders'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Date'
                      }
                    }
                  }
                }}
              />
            )}
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
    <StoreDetails title="Orders" value={data?.orderCount || "00"} bgColor="bg-[#afd7ff]" textColor="text-blue-500" />
  </div>
);
