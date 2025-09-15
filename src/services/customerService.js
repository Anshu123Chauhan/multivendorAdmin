import { apiurl } from "../config/config";
import { getCookie } from "../config/webStorage";
import axios from "axios";

const token = getCookie("zrotoken");

export const fetchCustomerData = async () => {
  try {
    const res = await axios.get(`${apiurl}/api/customers/customerList`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    return res?.data;
  } catch (error) {
    console.error(
      "Error fetching customer data:",
      error.response?.data || error.message
    );
  }
};
