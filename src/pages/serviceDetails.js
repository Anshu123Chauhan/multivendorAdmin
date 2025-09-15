import React, { useState, useEffect } from "react";
import Layout, { Container } from "../components/layout";
import { apiurl } from "../config/config";
import moment from "moment";
import BackHeader from "../components/backHeader";
import Cookies from "js-cookie";
// import { useUser } from "../config/userProvider";
import { ServicesDetails } from "../services/service";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Image } from "antd";
import { DynamicLoader } from "../components/loader";
import { formatdate } from "../components/formatDateTime";
import { LiaRupeeSignSolid } from "react-icons/lia";

function ServiceDetails() {
  const [detailData, setDetailData] = useState();
  const [loading, setLoading] = useState(false);
  const storeId = useParams();
  const Token = Cookies.get("zrotoken");

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const id = storeId?.id;
        const serviceList = await ServicesDetails(id);
        console.log(
          "------------------detailData------idf------>",
          serviceList.data
        );
        if (serviceList) {
          setDetailData(serviceList.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch service:", error);
      }
    };

    fetchData();
  }, [storeId]);

  const FormatDate = (date) => {
    return moment(date).format("MMMM Do YYYY");
  };

  return (
    <Layout>
      {loading ? (
        <DynamicLoader maintext="wait" subtext="Fetching Service Details" />
      ) : null}
      <Container>
        <BackHeader
          backButton={true}
          link="/service"
          title="Service Details"
          rightSide={
            <div className="flex justify-between">
              <span className="text-green-600 font-semibold">
                {detailData?.status}
              </span>
            </div>
          }
        />

        <div className="flex flex-col h-[90%] w-full  gap-y-8 mt-10 bg-white overflow-auto">
          <div className="flex h-full justify-between">
            <div className="w-[60%] h-full overflow-auto pl-10 ">
              <h2 className="text-2xl font-semibold text-orange-300 mb-4">
                Service Information
              </h2>
              <div className="grid grid-cols-4 gap-x-4 gap-y-4">
                {[
                  { label: "Service Name", value: detailData?.serviceName },
                  { label: "Service Code", value: detailData?.serviceCode },

                  { label: "Duration", value: detailData?.duration + " Mins" },
                  { label: "Male/Female", value: detailData?.gender },
                  { label: "Description", value: detailData?.description },
                  { label: "Category", value: detailData?.categoryName },
                  { label: "Sub Category", value: detailData?.subCategoryName },
                  { label: "Recommended", value: detailData?.recommended === 1 ? "Yes":"No" },
                  { label: "Tags", value: detailData?.tags },
                  { label: "Usp", value: detailData?.usp },
                  { label: "Additional Info", value: detailData?.additionalInfo },

                  {
                    label: "Price",
                    value:
                      detailData?.stores?.[0] !== null  ?(
                        <div className="space-y-4 w-96">
                          <div className="border rounded-lg shadow-sm bg-gray-50 p-3">
                            {/* Header Row */}
                            <div className="flex justify-between items-center font-semibold text-gray-700 border-b pb-2 mb-2">
                              <span>Price Code</span>
                              <span>Gender</span>
                              <span>Price</span>
                            </div>

                            {/* Mapped Data */}
                            {detailData?.stores?.map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center py-2"
                              >
                                <span className="text-gray-900">
                                  {item?.priceCode || "N/A"}
                                </span>
                                <span className="text-gray-900">
                                  {item?.gender}
                                </span>
                                <div>
                                  <div className="flex items-center ml-1">
                                    <LiaRupeeSignSolid className="text-green-600" />
                                    <span className="text-gray-900">
                                      {item?.price}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        "Not available"
                      ),
                  },
                ].map((item, index) => (
                  <React.Fragment key={index}>
                    <span className="text-gray-600 font-semibold col-span-1">
                      {item.label}:
                    </span>
                    <span className="text-gray-900 col-span-3 flex items-center capitalize">
                      {item?.icon ? item?.icon : null}
                      {item.value || (
                        <span className="italic text-gray-400">
                          Not available
                        </span>
                      )}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="w-[40%] p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-max mb-4">
                {detailData?.images ? (
                  detailData?.images.map((item, index) => {
                    return (
                      <Image
                        className="w-full h-auto rounded-lg  shadow-sm"
                        src={item?.url}
                        key={index}
                        preview={{
                          getContainer: false,
                          src: `${item?.url}`,
                        }}
                      />
                    );
                  })
                ) : (
                  <span className="text-gray-500 italic">
                    Image not available
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-max">
                {detailData?.videos ? (
                  detailData?.videos.map((vdo, index) => {
                    return (
                      <div key={index}>
                        <video
                          controls
                          className="w-48 object-cover rounded mb-2 "
                        >
                          <source src={vdo.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-gray-500 italic">
                    video not available
                  </span>
                )}
              </div>
            </div>
          </div>
          {detailData?.videoUrls?.length > 0 ? (
            <video controls className="w-[40%] object-cover rounded h-full">
              <source src={detailData.videoUrls[0].url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            ""
          )}
        </div>
      </Container>
    </Layout>
  );
}

export default ServiceDetails;
