import React, { useEffect, useState } from "react";
import Layout, { Container } from "../components/layout";
import { useUser } from "../config/userProvider";
import axios from "axios";
import { apiurl } from "../config/config";
import { DynamicLoader } from "../components/loader";

const Leaderboard = () => {
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  let { userData } = useUser();
  let vendorObjId = userData?.vendorDetails?.vendorObjId;

  useEffect(() => {
    let data = JSON.stringify({
      vendorObjId: vendorObjId,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiurl}/admin/v1/analytic/report/leaderboard`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify("Leaderboard", response.data));
        if (response.data.success === true) {
          setLeaderBoardData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [loader, setLoader] = useState(false);

  const filterHandler = (filter) => {
    // console.log("filter", filter);
    if (filter) {
      setLoader(true);
      let data = JSON.stringify({
        vendorObjId: vendorObjId,
        actionType: filter,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${apiurl}/admin/v1/analytic/report/leaderboard/action`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          if (response.data.success === true) {
            setLeaderBoardData(response.data.data);
            setLoader(false);
          }
        })
        .catch((error) => {
          setLoader(false);

          console.log(error);
        });
    }
  };
  // const UpdateLe
  return (
    <Layout>
      {loader && (
        <DynamicLoader maintext="wait" subtext="Fetching Store Data" />
      )}
      <Container>
        <div className=" overflow-auto  p-6 min-h-screen capitalize">
          <div className="max-w-7xl mx-auto">
            {/* Current Leaders Section */}
            <div>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold mb-4">Current Leaders</h2>

                <div className="flex gap-4 ">
                  <select
                    onChange={(e) => filterHandler(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded shadow-sm focus:outline-none capitalize"
                  >
                    <option value="">filters</option>
                    <option value="order_placed">Orders</option>
                    <option value="catalog_generated"> Generated</option>
                    <option value="catalog_downloaded">downloaded</option>
                    <option value="catalog_sent_email"> mail</option>
                    <option value="catalog_sent_whatsapp">whatsapp</option>
                    {/* <option value="catalog_sent"></option> */}
                  </select>
                  {/* <input
                    type="text"
                    placeholder="Search by user name"
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded shadow-sm focus:outline-none"
                  /> */}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Leader Cards */}
                {leaderBoardData[0] && (
                  <WinnerCard
                    // key={index}
                    name={leaderBoardData[0]?.userName}
                    orders={leaderBoardData[0]?.breakdown?.order_placed}
                    url="logo1.png"
                    Generated={leaderBoardData[0]?.breakdown?.catalog_generated}
                    mail={leaderBoardData[0]?.breakdown?.catalog_sent_email}
                    whatsapp={
                      leaderBoardData[0]?.breakdown?.catalog_sent_whatsapp
                    }
                  />
                )}
                {leaderBoardData[1] && (
                  <WinnerCard
                    // key={index}
                    name={leaderBoardData[1]?.userName}
                    orders={leaderBoardData[1]?.breakdown?.order_placed}
                    url="logo1.png"
                    Generated={leaderBoardData[1]?.breakdown?.catalog_generated}
                    mail={leaderBoardData[1]?.breakdown?.catalog_sent_email}
                    whatsapp={
                      leaderBoardData[1]?.breakdown?.catalog_sent_whatsapp
                    }
                  />
                )}
                {leaderBoardData[2] && (
                  <WinnerCard
                    // key={index}
                    name={leaderBoardData[2]?.userName}
                    orders={leaderBoardData[2]?.breakdown?.order_placed}
                    url="logo1.png"
                    Generated={leaderBoardData[2]?.breakdown?.catalog_generated}
                    mail={leaderBoardData[2]?.breakdown?.catalog_sent_email}
                    whatsapp={
                      leaderBoardData[2]?.breakdown?.catalog_sent_whatsapp
                    }
                  />
                )}

                {/* <div
                    key={index}
                    className="bg-white rounded-lg shadow border flex flex-col"
                  >
                    <div className="flex justify-between items-center p-5">
                      <div className="flex items-center gap-2 ">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center ">
                          <span className="text-xl">{leader.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-md text-slate-500">
                            {leader.name}
                          </h3>
                          <p className="text-xl font-bold">{leader.points}</p>
                        </div>
                      </div>
                      <img src={leader.url} className="h-10" />
                    </div>
                    <div className="grid grid-cols-3  mt-4 text-center border-t">
                      <div className="p-3">
                        <p className="text-sm text-gray-500">WINS</p>
                        <p className="font-medium">{leader.wins}</p>
                      </div>
                      <div className="border-x p-3">
                        <p className="text-sm  text-gray-500">TASKS</p>
                        <p className="font-medium">{leader.tasks}</p>
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-gray-500">ACH.</p>
                        <p className="font-medium">{leader.achievements}</p>
                      </div>
                    </div>
                  </div>
                ))} */}
              </div>
            </div>

            {/* Global Ranking Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold"> Ranking</h2>
                {/* <div className="flex gap-4">
                  <select className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded shadow-sm focus:outline-none">
                    <option>Task completed</option>
                    <option>Spent time</option>
                    <option>Victories</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search by user name"
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded shadow-sm focus:outline-none"
                  />
                </div> */}
              </div>
              <table className="w-full bg-white rounded-lg shadow">
                <thead>
                  <tr className="bg-gray-100  capitalize">
                    {[
                      "Rank",
                      "User name",
                      "Generated",
                      "mailed",
                      "whatsapp",
                      "downloads",
                      "Total Actions",
                    ].map((header, index) => (
                      <th
                        key={index}
                        className={`${
                          index === 0 || index === 1 ? "text-left" : "text-center"
                        } text-left py-3 px-4 text-gray-600 text-xs md:text-sm font-medium`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaderBoardData.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8  bg-zinc-100 rounded-full text-slate-600 flex justify-center items-center font-bold md:text-sm text-xs ">
                            {user?.userName?.[0] || ""}
                          </div>
                          <div>
                            <p className="font-medium md:text-base text-sm">
                              {user?.userName}
                            </p>
                            <p className="md:text-sm text-xs text-gray-500">
                              {user?.userId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {user?.breakdown?.catalog_generated}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {user?.breakdown?.catalog_sent_email}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {user?.breakdown?.catalog_sent_whatsapp}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {user?.breakdown?.catalog_downloaded}
                      </td>
                      <td className="py-3 px-4 text-center">{user?.totalActions}</td>
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

export default Leaderboard;

// const Winners = ({ index, userName, totalActions }) => {
//   return (
//     <div className={`text-center p-4 ${index === 0 ? "text-2xl" : "text-sm"}`}>
//       {/* <img
//         src="https://via.placeholder.com/100"
//         alt="avatar"

//       /> */}
//       <div
//         className={`w-20 h-20 mx-auto rounded-full border-4  font-bold text-zinc-400  flex justify-center items-center ${
//           index === 0 ? "border-yellow-600" : "border-gray-300"
//         }`}
//       >
//         #{index + 1}
//       </div>
//       <h2 className={`mt-2 font-bold ${index === 0 ? "text-xl" : "text-lg"}`}>
//         {userName ? userName : "unknown"}
//       </h2>
//       <p className="text-gray-600">🥉{totalActions ? totalActions : "0"}</p>
//     </div>
//   );
// };

const WinnerCard = ({ icon, name, orders, url, Generated, mail, whatsapp }) => {
  return (
    <div className="bg-white rounded-lg shadow border flex flex-col">
      <div className="flex justify-between items-center p-5">
        <div className="flex items-center gap-2">
          <div className="w-8 md:w-16 h-8 md:h-16 bg-zinc-100 rounded-full flex items-center justify-center">
            <span className="text-xl font-semibold text-slate-600">
              {name?.[0] || ""}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-xs md:text-base text-slate-500">
              {name}
            </h3>
            <p className="md:text-xl text-sm font-bold">{orders}</p>
          </div>
        </div>
        {url && <img src={url} alt="Leader Icon" className="md:h-10  h-6" />}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 mt-4 text-center border-t">
        <div className="p-3">
          <p className="text-sm text-gray-500">Generated</p>
          <p className="font-medium">{Generated}</p>
        </div>
        <div className="border-x p-3">
          <p className="text-sm text-gray-500">mail</p>
          <p className="font-medium">{mail}</p>
        </div>
        <div className="p-3 border-t md:border-none col-span-2 md:col-span-1">
          <p className="text-sm text-gray-500">whatsapp</p>
          <p className="font-medium">{whatsapp}</p>
        </div>
      </div>
    </div>
  );
};
