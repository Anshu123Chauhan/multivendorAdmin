import React, { useState, useEffect } from "react";
import Layout, { Container } from "../components/layout";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import { fetchCategoryDetail} from "../services/storeService";
import { FiSearch } from "react-icons/fi";
import { apiurl } from "../config/config";
import { useUser } from "../config/userProvider";
import SearchContainer from "../components/searchContainer";
import BackHeader from "../components/backHeader";
import Card from "../components/card";
import { DynamicLoader } from "../components/loader";
import { Image } from "antd";
import logo from "../assets/logo1.png"
function CategoryDetails() {
  const navigate = useNavigate();
  const { userData } = useUser();
  const CategoryId = useParams();
  console.log(CategoryId)
  // const {id} = storeId;

  const [categoryDetails, setCategoryDetails] = useState();
  const [loading, setLoading] = useState(false);


  const fetchCategoryList = async () => {
    const id = CategoryId?.id;
    try {
      setLoading(true);

      const response = await fetchCategoryDetail(id, 1, 10);
      console.log("Fetched data: by idddddddddddd------------->", response);

      if (response.success === true) {
        // console.log("Fetched iffffffff:", response.data.provider_descriptor.name);
        setCategoryDetails(response.data); // Assuming the data structure is an array
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("storeId", CategoryId);

    fetchCategoryList();
  }, [CategoryId]); // Added storeId as dependency to refetch when storeId changes


  return (
    <Layout>
      <Container>
        <BackHeader
          backButton={true}
          link="/category"
          title="Category Details"
          rightSide={
            <div className="flex justify-between">
              <span
                className={`font-semibold ${
                  categoryDetails?.data?.status === "ACTIVE"
                    ? "text-green-600" // Green for ACTIVE
                    : "text-red-600" // Red for INACTIVE
                }`}
              >
                {categoryDetails?.data?.status}
              </span>
            </div>
          }
        />

        <div className="flex flex-col h-[90%] w-full  gap-y-8 mt-10 bg-white overflow-scroll">
          <div className="flex h-full justify-between">
            <div className="w-[40%] p-3">
              {categoryDetails &&
                (
                // <img
                //   src={categoryDetails?.data?.provider_descriptor?.images}
                //   alt="Store Symbol"
                //   className="w-full  object-contain rounded-lg shadow-sm"
                // />
                <>
                <p className="text-md text-center p-2 font-[600]">Category Image</p>
                <Image
                  className="max-w-full max-h-full object-contain rounded-lg  shadow-sm"
                  src={
                    categoryDetails?.image
                  }
                  preview={{
                    maskClassName: "w-full",
                    getContainer: false,
                    src: `${
                       categoryDetails?.image
                      
                    }`,
                  }}
                />
               
                
                </>
              ) }
            </div>
            <div className="w-[60%] h-full overflow-auto pl-10 ">
              <h2 className="text-2xl font-semibold text-orange-300 mb-4">
                Category Information
              </h2>
              <div className="grid grid-cols-4 gap-x-4 gap-y-4">
                {[
                  {
                    label: "Category Name",
                    value: categoryDetails?.name,
                  },
                  {
                    label: "Description",
                    value: categoryDetails?.description,
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

export default CategoryDetails;
