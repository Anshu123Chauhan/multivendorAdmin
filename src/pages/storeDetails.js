import React, { useState, useEffect } from "react";
import Layout, { Container } from "../components/layout";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import { fetchStoreDetail } from "../services/storeService";
import { FiSearch } from "react-icons/fi";
import { apiurl } from "../config/config";
import { useUser } from "../config/userProvider";
import SearchContainer from "../components/searchContainer";
import BackHeader from "../components/backHeader";
import Card from "../components/card";
import { DynamicLoader } from "../components/loader";
import { Image } from "antd";

function StoreDetails() {
  const navigate = useNavigate();
  const { userData } = useUser();
  const storeId = useParams();
  // const {id} = storeId;

  const [storeDetails, setStoreDetails] = useState();
  const [loading, setLoading] = useState(false);

  // const fetchStoreList = async (data) => {
  //   console.log("storeId >>>>>>>>",data)
  const fetchStoreList = async () => {
    const id = storeId?.id;
    try {
      setLoading(true);

      const response = await fetchStoreDetail(id, 1, 10);
      console.log("Fetched data:", response);

      if (response.success === true) {
        // console.log("Fetched iffffffff:", response.data.provider_descriptor.name);
        setStoreDetails(response.data); // Assuming the data structure is an array
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("storeId", storeId);

    fetchStoreList();
  }, [storeId]); // Added storeId as dependency to refetch when storeId changes

  // console.log(
  //   "storeDetails?.data?.provider_descriptor?.images ",
  //   storeDetails?.data[0]?.provider_descriptor?.images[0]
  // );
  return (
    <Layout>
      <Container>
        <BackHeader
          backButton={true}
          link="/stores"
          title="Store Details"
          rightSide={
            <div className="flex justify-between">
              <span
                className={`font-semibold ${
                  storeDetails?.data?.status === "ACTIVE"
                    ? "text-green-600" // Green for ACTIVE
                    : "text-red-600" // Red for INACTIVE
                }`}
              >
                {storeDetails?.data?.status}
              </span>
            </div>
          }
        />

        <div className="flex flex-col h-[90%] w-full  gap-y-8 mt-10 bg-white">
          <div className="flex h-full justify-between">
            <div className="w-[40%] flex justify-center p-3">
              {storeDetails &&
              storeDetails?.image ? (
                // <img
                //   src={storeDetails?.data?.provider_descriptor?.images}
                //   alt="Store Symbol"
                //   className="w-full  object-contain rounded-lg shadow-sm"
                // />
                <Image
                  className="max-w-full max-h-full object-contain rounded-lg  shadow-sm"
                  src={
                    storeDetails &&
                    storeDetails?.images
                  }
                  preview={{
                    maskClassName: "w-full",
                    getContainer: false,
                    src: `${
                      storeDetails &&
                      storeDetails?.image
                    }`,
                  }}
                />
              ) : (
                <span className="text-gray-500 italic">
                  Image not available
                </span>
              )}
            </div>
            <div className="w-[60%] h-full overflow-auto pl-10 ">
              <h2 className="text-2xl font-semibold text-orange-300 mb-4">
                Store Information
              </h2>
              <div className="grid grid-cols-4 gap-x-4 gap-y-4">
                {[
                  {
                    label: "Store Name",
                    value: storeDetails?.storeName,
                  },
                  {
                    label: "Region",
                    value: storeDetails?.region,
                  },
                  
                ].map(
                  (item, index) =>
                    item.value && (
                      <React.Fragment key={index}>
                        <span className="text-gray-600 font-semibold col-span-1">
                          {item.label}:
                        </span>
                        <span className="text-gray-900 col-span-3 capitalize">
                          {item.value || (
                            <span className="italic text-gray-400">
                              Not available
                            </span>
                          )}
                        </span>
                      </React.Fragment>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export default StoreDetails;
