import React, { useEffect, useState } from "react";
import Layout, { Container } from "../components/layout";
import { useUser } from "../config/userProvider";
import axios from "axios";
import { apiurl } from "../config/config";
import { DynamicLoader } from "../components/loader";
import { getCookie } from "../config/webStorage";
import { useNavigate } from "react-router-dom";

// no use

const Vendors = () => {
  let navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  let { userData } = useUser();
  let token = getCookie("zrotoken");

  useEffect(() => {
    setLoader(true);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiurl}/api/vendor/getAll`,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.success === true) {
          setVendorData(response.data.data);
        }
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, []);

  const goVendorDetails = (id) => {
    navigate(`/vendors/${id}`);
  };

  return (
    <Layout>
      {loader && (
        <DynamicLoader maintext="wait" subtext="Fetching Vendors Data" />
      )}
      <Container>
        <div className=" overflow-auto  p-6 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold"> Vendors</h2>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Search by name"
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded shadow-sm focus:outline-none"
                  />
                </div>
              </div>
              <table className="w-full bg-white rounded-lg shadow">
                <thead>
                  <tr className="bg-gray-100 capitalize">
                    {[
                      "SN",
                      "Store Details",
                      "Owner Details",
                      "Email",
                      "Phone Number",
                      "Status",
                    ].map((header, index) => (
                      <th
                        key={index}
                        className={`${
                          index === 0 || index === 1
                            ? "text-left"
                            : "text-center"
                        } text-left py-3 px-4 text-gray-600 text-xs md:text-sm font-medium`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vendorData.map((vendor, index) => (
                    <tr
                      key={index}
                      className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                      onClick={() => goVendorDetails(vendor?._id)}
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-medium md:text-base text-sm capitalize">
                              {vendor?.vendorDetails?.name}
                            </p>
                            <p className="md:text-sm text-xs text-gray-500">
                              {vendor?.vendorDetails?.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div>
                          <p className="font-medium md:text-base text-sm capitalize">
                            {vendor?.ownerDetails?.name}
                          </p>
                          <p className="md:text-sm text-xs text-gray-500">
                            {vendor?.ownerDetails?.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {vendor?.vendorDetails?.email}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {vendor?.vendorDetails?.phone}
                      </td>
                      <td
                        className={`py-3 px-4 text-center capitalize ${
                          vendor?.vendorDetails?.status === "enabled"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {vendor?.vendorDetails?.status}
                      </td>
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

export default Vendors;
