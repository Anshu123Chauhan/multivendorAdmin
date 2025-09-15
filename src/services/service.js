import { apiurl } from "../config/config";
import { getCookie } from "../config/webStorage";
import axios from "axios";

const token = getCookie("zrotoken");

export const fetchServiceList = async (current_Page = "1", limit = '10', search = "") => {
  console.log(search, "searchforproductlist")
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiurl}/api/products?page=${current_Page}&limit=${limit}&search=${search}`,
      headers: {
        Authorization: token,
      },
    };

    const response = await axios.request(config);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Allow the caller to handle the error
  }
};


export const ServicesDetails = async (id) => {
  try {
    const config = {
      method: "GET",
      maxBodyLength: Infinity,
      url: `${apiurl}/admin/service/getServiceById/${id}`,
      headers: {
        Authorization: token,
        "ngrok-skip-browser-warning": "69420",
      },
      data: { id },
    };

    const response = await axios.request(config);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Allow the caller to handle the error
  }
};



