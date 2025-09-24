import React, { useState, useEffect, useMemo } from "react";
import Layout, { Container } from "../components/layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiurl } from "../config/config";
import { useUser } from "../config/userProvider";
import BackHeader from "../components/backHeader";
import { Image } from "antd";
import { getCookie } from "../config/webStorage";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function CustomerDetails() {
  const navigate = useNavigate();
  const { userData } = useUser();
  const customerId = useParams();
  const id=customerId?.id
  // console.log(id)
  // const {id} = storeId;
    const token = getCookie("zrotoken");
    const decodedToken = useMemo(() => {
      if (!token) return null;
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error("Invalid token:", error);
        return null;
      }
    }, [token]);
    

  const [customerDetails, setcustomerDetails] = useState();
  const [loading, setLoading] = useState(false);


  const fetchcustomerList = async () => {
   
    try {
          const res = await axios.get(`${apiurl}/admin/customer-get/${id}`, {
            headers: { Authorization: token},
          });
          // console.log(res)
          if (res.status === 200) {
            setcustomerDetails(res.data.customer);
          }
        } catch (error) {
          console.error("Error fetching customer:", error);
          toast.error("Failed to fetch customer details");
        } finally {
          setLoading(false);
        }
  };
 useEffect(() => {
  // console.log("storeId", id);

  if (decodedToken?.userType === "Admin") {
    fetchcustomerList();
  }
}, [id, decodedToken]); 



  return (
    <Layout>
      <Container>
        <BackHeader
          backButton={true}
          link="/customers"
          title="Customer Details"
          rightSide={
            <div className="flex justify-between">
              <span
                className={`font-semibold ${
                  customerDetails?.data?.status === "ACTIVE"
                    ? "text-green-600" // Green for ACTIVE
                    : "text-red-600" // Red for INACTIVE
                }`}
              >
                {customerDetails?.data?.status}
              </span>
            </div>
          }
        />

        <div className="flex flex-col h-[90%] w-full  gap-y-8 mt-10 bg-white overflow-scroll">
          <div className="flex h-full justify-between">
            <div className="w-[40%] p-3">
              {customerDetails &&
                (
                // <img
                //   src={customerDetails?.data?.provider_descriptor?.images}
                //   alt="Store Symbol"
                //   className="w-full  object-contain rounded-lg shadow-sm"
                // />
                <>
                <p className="text-md text-center p-2 font-[600]">Customer Image</p>
                <Image
                  className="max-w-full max-h-full object-contain rounded-lg  shadow-sm"
                  src={
                    customerDetails?.image ||"http://res.cloudinary.com/dv5del8nh/image/upload/v1758709597/zwyubadp5ra0wbzsl6uu.png"
                  }
                  preview={{
                    maskClassName: "w-full",
                    getContainer: false,
                    src: `${
                       customerDetails?.image || "http://res.cloudinary.com/dv5del8nh/image/upload/v1758709597/zwyubadp5ra0wbzsl6uu.png"
                      
                    }`,
                  }}
                />
               
                
                </>
              ) }
            </div>
            <div className="w-[60%] h-full overflow-auto pl-10 ">
              <h2 className="text-2xl font-semibold text-orange-300 mb-4">
                Customer Information
              </h2>
              <div className="grid grid-cols-4 gap-x-4 gap-y-4">
                {[
                  {
                    label: "Customer Name",
                    value: customerDetails?.name,
                  },
                  {
                    label: "Email",
                    value: customerDetails?.email,
                  },
                  {
                    label: "Phone Number",
                    value: customerDetails?.phone,
                  },
                  
                  
                ].map(
                  (item, index) =>
                    item.value && (
                      <React.Fragment key={index}>
                        <span className="text-gray-600 font-semibold col-span-1">
                          {item.label}:
                        </span>
                        <span className="text-gray-900 col-span-3">
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

export default CustomerDetails;
