import React, { useEffect, useState } from "react";
import Layout from "../components/layout.js";
import { Link, NavLink } from "react-router-dom";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { FiSearch } from "react-icons/fi";
import { useUser } from "../config/userProvider.js";
import { BiCloset } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { getCookie } from "../config/webStorage.js";
import { apiurl } from "../config/config.js";
import NoInternetConnection from "../components/noInternetConnection";
import { GoDot } from "react-icons/go";
import { FaCheck } from "react-icons/fa6";

const Dashboard = () => {
  const { userData, permissions } = useUser();
  let vendorObjId = userData?.vendorDetails?.vendorObjId;

  const token = getCookie("zrotoken");
  const [searchInput, setSearchInput] = useState("");
  const [pieData, setPieData] = useState("");
  const [analyticsData, setAnalyticsData] = useState("");
  const [userCount, setUserCount] = useState(null);
  const [data, setData] = useState("");

  const [loadingData, setLoadingData] = useState(false);

  const [SearchParam] = ["storecode,Address,storename"];
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  //console.log("analyticsData?.activeUsers", analyticsData);
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const UserHandler = () => {
  //   axios
  //     .get(`${apiurl}/api/dashboard/dashboardUserStatus`, {
  //       headers: {
  //         Authorization: token, // Replace 'token' with your actual token variable
  //       },
  //     })
  //     .then((response) => {
  //       if (response.data.success === true) {
  //         // console.log("SuccessSuccess", response.data);
  //         setUserCount(response.data.data);
  //       } else {
  //         setError("Failed to fetch data");
  //       }
  //     })
  //     .catch((error) => {
  //       setError("An error occurred: " + error.message);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   // Fetch user details from the API
  //   //stage.myindia.com:5050/
  //   // .get(`${apiurl}/api/dashboard/userDetails`, {
  //   UserHandler();
  // }, []);

  return (
    <Layout>
      <div className="relative overflow-y-scroll h-full">
        <div className="flex flex-col items-start justify-between gap-1 w-full sm:p-0 p-2 rounded-lg">
          <div className="w-full">
            <div className="flex w-full">
              <Dashboard1
                // chartData={chartData}
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

const CardContainer = ({ children, imgSrc, to }) => (
  <NavLink
    className="shadow-sm rounded-lg p-2 lg:p-3 flex gap-0.5 lg:gap-2 items-center bg-white/100"
    to={to}
  >
    <img className="h-4 lg:h-7" src={imgSrc} alt="" />
    <h2 className="text-xs lg:text-base">{children}</h2>
  </NavLink>
);

const AnalyticsCardContainer = ({
  label,
  value,
  icon,
  IconBackgroundColor,
  className,
  loadingData,
  userCount,
}) => (
  <div
    className={`shadow-sm bg-white/100 m-1 rounded-lg md:p-4 p-3 py-3 flex flex-col w-[46.5%] md:w-[24%] ${className}`}
  >
    <div className="flex gap-1 items-center whitespace-pre">
      <div
        className={`${IconBackgroundColor} p-1 rounded-lg md:text-base text-xs`}
      >
        {icon}
      </div>
      <p className="font-medium text-[0.65rem] md:text-sm">{label}</p>
    </div>
    {loadingData ? (
      <Loading_Card />
    ) : (
      <h1 className="font-semibold text-2xl lg:text-5xl text-end">{value}</h1>
    )}
  </div>
);

const Loading_Card = ({ lines, className, ContainerclassName }) => (
  <div
    role="status"
    className={`max-w-full animate-pulse mt-2 ${ContainerclassName}`}
  >
    <div
      className={`h-full bg-gray-200 rounded-lg w-full mb-4 ${className}`}
    ></div>
  </div>
);

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
  // console.log("token123", token);
  const [isVerified, setIsVerified] = useState({
    email: null,
    phone: null,
    store: null,
  });

  const verificationDetails = userData?.verificationDetails;

  const isEmailVerified = verificationDetails?.isEmailVerified;
  const isPhoneVerified = verificationDetails?.isPhoneVerified;
  const isStoreVerified = userData?.storeDetails?.storeObjId;

  useEffect(() => {
    if (userData?.userType === "superadmin") {
      if (!isEmailVerified && !isPhoneVerified) {
        setIsVerified({ email: false, phone: false });
      } else if (isEmailVerified && !isPhoneVerified) {
        setIsVerified({ email: true, phone: false });
      } else if (!isEmailVerified && isPhoneVerified) {
        setIsVerified({ email: false, phone: true });
      } else if (isEmailVerified && isPhoneVerified) {
        setIsVerified({ email: true, phone: true });
      }
    }
  }, [userData, verificationDetails]);

  const storeVerified =
    userData?.userType === "admin" || userData?.userType === "user"
      ? !isVerified.store
      : null;

  const [verifyPopUp, setVerifyPopUp] = useState(
    !isVerified.email || !isVerified.phone || storeVerified
  );

  const [getAnalyticsData, setGetAnalyticsData] = useState({});
  const [yAxisMax, setYAxisMax] = useState(null);

  // const [data, setData] = useState("");

  useEffect(() => {
    let data = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiurl}/admin/service/totalCount`,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "ngrok-skip-browser-warning": "69420",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        //console.log(JSON.stringify(response.data));

        setData(response.data.data);
        const totalStore = response.data.data;
        console.log("totalStore", totalStore);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // useEffect(() => {
  //   if (data && data.dayWiseSalesOrders) {
  //     const labels = data.dayWiseSalesOrders.map((item) => {
  //       const date = new Date(item._id);
  //       return `${date.getDate()}-${date.getMonth() + 1}`; // Format: DD-MM
  //     });

  //     const salesData = data?.dayWiseSalesOrders.map((item) => item.totalSales);

  //     setChartData({
  //       ...chartData,
  //       labels: labels,
  //       datasets: [
  //         {
  //           ...chartData.datasets[0],
  //           data: salesData,
  //         },
  //       ],
  //     });
  //   }
  // }, [data]);

  const {
    topCategories = [],
    topServices = [],
    topSubcategories = [],
    totalFemale = 0,
    totalMale = 0,
    totalUsers = 0,
  } = getAnalyticsData?.today || {};

  console.log("topCategories----------->", topCategories);

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

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get(`${apiurl}/admin/analytics/dashboard`);
      console.log("/api/admin/analytics/dashboard", response.data);

      if (response.data?.success === true) {
        const analytics = response?.data?.data;
        setGetAnalyticsData(analytics);

        const priceCodeUserCount = analytics?.today?.priceCodeUserCount || {};

        const labels = Object.keys(priceCodeUserCount);
        const dataValues = labels.map((label) => {
          const value = priceCodeUserCount[label];
          return typeof value === "string" ? parseInt(value) : value;
        });

        console.log("Chart Labels:", labels);
        console.log("Chart Values:", dataValues);

        const maxValue = Math.max(...dataValues);
        const yAxisMax = Math.ceil(maxValue + 1);

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
        setYAxisMax(yAxisMax); 
      }
    } catch (error) {
      console.error("Error fetching dashboard analytics data:", error);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  console.log("chartData chartData_________________------------->>", chartData);

  return (
    <div className="w-full">
      <div className="flex flex-col items-start md:flex-row w-full gap-2">
        {/* Total Profit Section */}
        <div className="w-full md:w-1/3  flex flex-col gap-2">
          <div className="bg-white rounded-lg shadow p-4 md:p-6 ">
            <h2 className="text-lg md:text-2xl font-semibold">
              Today's Analytics
            </h2>

            <div className="mt-6 flex flex-col gap-4 ">
              <Link to="/userlist">
                <StatCard
                  label="Total Users"
                  value={totalUsers}
                  color="#E9CFFC"
                  // onClick={() => setPopUp("catalog generated")}
                />
              </Link>
              <StatCard label="Total Search For Male" value={totalMale} color="#f4eeee" />

              <StatCard
                label="Total Search For Female"
                value={totalFemale}
                color="#D0C2E3"

                // onClick={() => setPopUp("catalog_sent_whatsapp")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
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
        </div>

        <div className="w-full md:w-2/3  flex flex-col gap-2">
          <div className="flex flex-col bg-white rounded-lg shadow p-4 md:p-6  ">
            {/* <h2 className="md:text-lg text-sm font-semibold mb-4">
              Store Data Details
            </h2> */}

            <AnalyticsDashboard
              analyticsData={analyticsData}
              data={data}
              userCount={userCount}
            />
          </div>

          <div
            className={`shadow  rounded-lg ${
              permissions?.analytics === true && ""
            } w-full  bg-white/100  p-3 py-6`}
          >
            <Line
              data={chartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: yAxisMax || undefined, 
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ label, value, onClick, color }) => (
  <div
    className="text-center w-full border rounded-xl flex justify-between items-center px-3 py-3"
    onClick={onClick}
  >
    <p className="text-sm md:text-base font-semibold flex items-center gap-2  capitalize">
      <GoDot />
      {label}
    </p>
    <p
      className={` font-semibold text-gray-800 px-5 rounded-full text-xs md:text-sm`}
      style={{ backgroundColor: color }}
    >
      {value}
    </p>
  </div>
);

const TokenAllocation = ({ name, value }) => (
  <div className="p-3 md:p-4 bg-gray-100 rounded-md text-center">
    <p className="text-base md:text-lg font-semibold text-gray-800">{name}</p>
    <p className="text-sm md:text-base text-gray-500">{value}</p>
  </div>
);

const PortfolioRow = ({
  asset,
  symbol,
  balance,
  avgBuyPrice,
  profitLoss,
  value,
  isProfit,
}) => (
  <div className="flex flex-col md:grid md:grid-cols-5 gap-2 md:gap-4 py-4 border-b last:border-b-0  overflow-auto">
    <div className="flex items-center space-x-3">
      <div className="font-bold text-sm md:text-base">{asset}</div>
      <p className="text-xs text-gray-400">{symbol}</p>
    </div>
    <div className="text-sm md:text-base text-gray-700">{balance}</div>
    <div className="text-sm md:text-base text-gray-700">{avgBuyPrice}</div>
    <div
      className={`text-sm md:text-base font-semibold ${
        isProfit ? "text-green-500" : "text-red-500"
      }`}
    >
      {profitLoss}
    </div>
    <div className="text-sm md:text-base text-gray-700">{value}</div>
  </div>
);

const RetentionGrid = () => (
  <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mt-4 text-center">
    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => (
      <div
        key={index}
        className="p-2 bg-blue-100 text-blue-800 rounded-lg text-xs md:text-sm"
      >
        {month}
      </div>
    ))}
  </div>
);

// export default Dashboard;

const StoreDetails = ({
  title,
  value,
  icon,
  bgColor = "bg-purple-100",
  textColor = "text-green-500",
  className,
}) => {
  return (
    <div
      className={`${className} ${bgColor}  flex flex-col w-full py-3 pb-10 h-20 md:h-24 lg:h-32 max-h-28 rounded-lg relative`}
    >
      <div className="flex justify-end">
        <div
          className={` bg-white font-semibold p-2   px-4 rounded-md rounded-r-none uppercase  max-[1000px]:text-xs  min-[1000px]:text-sm max-[1400px]:text-sm min-[1400px]:text-xl ${
            textColor ? textColor : ""
          }`}
        >
          {title}
        </div>
      </div>
      <div className=" max-[1000px]:text-lg  min-[1000px]:text-2xl max-[1400px]:text-2xl min-[1400px]:text-4xl font-bold text-white pl-3 pb-3  ">
        {value}
      </div>
    </div>
  );
};

const AnalyticsDashboard = ({ analyticsData, totalStore, data, userCount }) => {
  // console.log("userCountuserCount", userCount);
  return (
    <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
      <StoreDetails
        title="Stores"
        value={data?.totalStores || "00"}
        // icon={analyticsData?.todayReport?.catalog_generated > 0 ? "↑" : "↓"}
        // bgColor="bg-gradient-to-br from-red-300 to-red-100"
        bgColor="bg-[#fcafaf]"
        textColor="text-red-500"
      />

      <StoreDetails
        title="Categories"
        value={data?.totalCategories || "00"}
        // icon={data?.totalUsers > 0 ? "↑" : "↓"}
        // bgColor="bg-gradient-to-br from-purple-300 to-purple-100"

        bgColor="bg-[#e4cbfe]"
        textColor="text-purple-500"
      />

      <StoreDetails
        title="SubCategories"
        value={data?.totalSubCategories || "00"}
        // icon="↑"
        //bgColor="bg-gradient-to-br from-orange-300 to-orange-100"
        bgColor="bg-[#fed7ab]"
        textColor="text-orange-500"
      />
      <StoreDetails
        title="Services"
        value={data?.totalServices || "00"}
        // icon="↓"
        // bgColor="bg-gradient-to-br from-amber-300 to-amber-100"
        bgColor="bg-[#fde592]"
        textColor="text-amber-500"
      />
      {/* <StoreDetails
        title="Sales"
        value={data?.todaySales || "00"}
        // icon="↓"
        bgColor="bg-gradient-to-br from-sky-300 to-sky-100 col-span-2"
        textColor="text-sky-500"
      /> */}
    </div>
  );
};
