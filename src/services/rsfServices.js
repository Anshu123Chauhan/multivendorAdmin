import { apiurl } from "../config/config";
import { getCookie } from "../config/webStorage";

import axios from "axios";

const token = getCookie("zrotoken");

export const getsettledList = async (current_Page,inputSearch) => {
  try {
    const response = await axios.get(`${apiurl}/api/transactionRoute/get_transactions_list_settled?page=${current_Page}&limit=${10}&search=${inputSearch}`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data; // Log the response data
  } catch (error) {
    console.error("Error fetching store list:", error);
  }
};
export const getunsettledList = async (current_Page,inputSearch) => {
    try {
      const response = await axios.get(`${apiurl}/api/transactionRoute/get_transactions_list_unsettled?page=${current_Page}&limit=${10}&search=${inputSearch}`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data; // Log the response data
    } catch (error) {
      console.error("Error fetching store list:", error);
    }
  };



