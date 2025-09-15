import { apiurl } from "../config/config";
import { getCookie } from "../config/webStorage";
import axios from "axios";
const token = getCookie("zrotoken");

export const fetchAnalytics = async (start, end) => {
  try {
    const response = await axios.get(
      `${apiurl}/api/analytics/TopOrderApi?startDate=${start}&endDate=${end}`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching store detail:", error);
  }
};

export const LiveAnalytics = async () => {
  try {
    const response = await axios.get(`${apiurl}/api/analytics/liveData`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching store detail:", error);
  }
};


export const CreateGcredentials = async (formData) => {
  try {
    let data = JSON.stringify({
      analytics: {
        ...formData,
      },
    });
    const response = await axios.post(
      `${apiurl}/api/google_analytics/create_analytics`,
      data,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching store detail:", error);
  }
};

export const handleGetCredentials = async () => {
  try {
    const response = await axios.get(`${apiurl}/api/google_analytics/list_analytics`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching store detail:", error);
  }
};