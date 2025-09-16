import React, { useState, useEffect } from "react";
import Layout, { Container } from "../components/layout";
import { useParams, useNavigate } from "react-router-dom";
import { subfetchCategoryDetail } from "../services/storeService";
import { useUser } from "../config/userProvider";
import BackHeader from "../components/backHeader";
import { Image } from "antd";

function SubcategoryDetails() {
  const navigate = useNavigate();
  const { userData } = useUser();
  const CategoryId = useParams();
  const [categoryDetails, setCategoryDetails] = useState();
  const [loading, setLoading] = useState(false);

  const fetchCategoryList = async () => {
    const id = CategoryId?.id;
    try {
      setLoading(true);
      const response = await subfetchCategoryDetail(id, 1, 10);
      if (response.success === true) {
        setCategoryDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, [CategoryId]);

  return (
    <Layout>
      <Container>
        <BackHeader
          backButton={true}
          link="/subcategory"
          title="Sub Category Details"
          rightSide={
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  categoryDetails?.data?.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {categoryDetails?.data?.status}
              </span>
            </div>
          }
        />

        <div className="bg-white rounded-xl shadow-md p-6 mt-8 w-full flex flex-col gap-6 overflow-scroll h-[90%]">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image Section */}
            <div className="lg:w-[40%]">
              {categoryDetails?.image ? (
                <>
                <p className="text-md text-center p-2 font-[600]">Sub Category Image</p>

                <Image
                  className="rounded-lg shadow-md max-h-96 object-contain"
                  src={categoryDetails?.image}
                  preview={{
                    maskClassName: "w-full",
                    getContainer: false,
                    src: categoryDetails?.image,
                  }}
                />
                </>
              ) : (
                <div className="text-gray-400 italic">No Image Available</div>
              )}
              
              
            </div>

            {/* Details Section */}
            <div className="lg:w-[60%] w-full">
              <h2 className="text-2xl font-semibold text-orange-300 mb-4">
                Sub Category Information
              </h2>
              <div className="space-y-4">
                <p className="text-base text-gray-800">
                  <span className="font-semibold text-gray-600">Category Name:</span>{" "}
                  <span className="capitalize">{categoryDetails?.category.name || "NA"}</span>
                </p>
                <p className="text-base text-gray-800">
                  <span className="font-semibold text-gray-600">Sub Category Name:</span>{" "}
                  <span className="capitalize">{categoryDetails?.name || "NA"}</span>
                </p>
                <p className="text-base text-gray-800">
                  <span className="font-semibold text-gray-600">Description:</span>{" "}
                  <span>
                    {categoryDetails?.description &&
                    categoryDetails.description.trim() !== ""
                      ? categoryDetails.description
                      : "NA"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export default SubcategoryDetails;
