import { apiurl } from "../config/config";
import { getCookie } from "../config/webStorage";

import axios from "axios";

const token = getCookie("zrotoken");


export const fetchStoreDetail = async (id, currentPage, limit = 10) => {
  try {
    const response = await axios.get(
      // `${apiurl}/api/storeRoute/get_store_detail?page=${currentPage}&limit=${limit}`,
      `${apiurl}/admin/store/getStoreById/${id}`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",

          "ngrok-skip-browser-warning": "69420",

        },
      }
    );
    
    return response.data; // Log the response data
  } catch (error) {
    console.error("Error fetching store detail:", error);
  }
};
export const fetchCategoryDetail = async (id, currentPage, limit = 10) => {
  try {
    const response = await axios.get(
      // `${apiurl}/api/storeRoute/get_store_detail?page=${currentPage}&limit=${limit}`,
      `${apiurl}/admin/category/${id}`,
      
      {
        headers: {
          Authorization: token,
        },
      }
    );
    
    return response.data; // Log the response data
  } catch (error) {
    console.error("Error fetching store detail:", error);
  }
};
export const subfetchCategoryDetail = async (id, currentPage, limit = 10) => {
  try {
    const response = await axios.get(
      // `${apiurl}/api/storeRoute/get_store_detail?page=${currentPage}&limit=${limit}`,
      `${apiurl}/admin/category/sub/${id}`,
      
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        
        },
      }
    );
    
    return response.data; // Log the response data
  } catch (error) {
    console.error("Error fetching store detail:", error);
  }
};
export const fetchBrandDetail = async (id, currentPage, limit = 10) => {
  try {
    const response = await axios.get(
      // `${apiurl}/api/storeRoute/get_store_detail?page=${currentPage}&limit=${limit}`,
      `${apiurl}/admin/brand/${id}`,
      
      {
        headers: {
          Authorization: token,
        },
      }
    );
    
    return response.data; // Log the response data
  } catch (error) {
    console.error("Error fetching store detail:", error);
  }
};
