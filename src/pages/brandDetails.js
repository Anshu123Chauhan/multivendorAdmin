import React, { useState, useEffect } from "react";
import Layout, { Container } from "../components/layout";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import { fetchCategoryDetail,fetchBrandDetail} from "../services/storeService";
import { FiSearch } from "react-icons/fi";
import { apiurl } from "../config/config";
import { useUser } from "../config/userProvider";
import SearchContainer from "../components/searchContainer";
import BackHeader from "../components/backHeader";
import Card from "../components/card";
import { DynamicLoader } from "../components/loader";
import { Image } from "antd";
import logo from "../assets/logo1.png"
function BrandDetails() {
  const navigate = useNavigate();
  const { userData } = useUser();
  const brandId = useParams();
  console.log(brandId)
  // const {id} = storeId;

  const [brandDetails, setBrandDetails] = useState();
  const [loading, setLoading] = useState(false);


  const fetchBrandList = async () => {
    const id = brandId?.id;
    try {
      setLoading(true);

      const response = await fetchBrandDetail(id, 1, 10);
      console.log("Fetched data: by idddddddddddd------------->", response);

      if (response.success === true) {
        // console.log("Fetched iffffffff:", response.data.provider_descriptor.name);
        setBrandDetails(response.data); // Assuming the data structure is an array
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("storeId", brandId);

    fetchBrandList();
  }, [brandId]); // Added storeId as dependency to refetch when storeId changes


  return (
    <Layout>
      <Container>
        <BackHeader
          backButton={true}
          link="/brand"
          title="Brand Details"
          rightSide={
            <div className="flex justify-between">
              <span
                className={`font-semibold ${
                  brandDetails?.data?.status === "ACTIVE"
                    ? "text-green-600" // Green for ACTIVE
                    : "text-red-600" // Red for INACTIVE
                }`}
              >
                {brandDetails?.data?.status}
              </span>
            </div>
          }
        />

        <div className="flex flex-col h-[90%] w-full  gap-y-8 mt-10 bg-white overflow-scroll">
          <div className="flex h-full justify-between">
            <div className="w-[40%] p-3">
              {brandDetails &&
                (
                // <img
                //   src={categoryDetails?.data?.provider_descriptor?.images}
                //   alt="Store Symbol"
                //   className="w-full  object-contain rounded-lg shadow-sm"
                // />
                <>
                <p className="text-md text-center p-2 font-[600]">Brand Image</p>
                <Image
                  className="max-w-full max-h-full object-contain rounded-lg  shadow-sm"
                  src={
                    brandDetails?.image
                  }
                  preview={{
                    maskClassName: "w-full",
                    getContainer: false,
                    src: `${
                       brandDetails?.image
                      
                    }`,
                  }}
                />
               
                
                </>
              ) }
            </div>
            <div className="w-[60%] h-full overflow-auto pl-10 ">
              <h2 className="text-2xl font-semibold text-orange-300 mb-4">
                Brand Information
              </h2>
              <div className="grid grid-cols-4 gap-x-4 gap-y-4">
                {[
                  {
                    label: "Brand Name",
                    value: brandDetails?.name,
                  },
                  {
                    label: "Description",
                    value: brandDetails?.description,
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

export default BrandDetails;
