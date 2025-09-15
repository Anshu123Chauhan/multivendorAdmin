import { apiurl } from "../config/config";
import { getCookie } from "../config/webStorage";
import axios from "axios";
const token = getCookie("zrotoken");

export const fetchBanners = async () => {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiurl}/api/banners/banner_list`,
      headers: {
        Authorization: token,
      },
    };

    const response = await axios.request(config);
    console.log("response1888", response);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const fetchBestSellerBanners = async () => {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiurl}/api/best_sellers`,
      headers: {
        Authorization: token,
      },
    };

    const response = await axios.request(config);
    console.log("response1888", response);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const ListBannerSetting = async () => {
  try {
    // const data = JSON.stringify({ ...payload });
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiurl}/api/banners/bannerSettingList`,
      headers: {
        Authorization: token,
      },
    };

    const response = await axios.request(config);
    console.log("response.data", response.data);

    return response.data;
  } catch (err) {
    console.error(err);
  }
};
export const CreateBannerSetting = async (payload) => {
  try {
    const data = JSON.stringify(payload);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiurl}/api/banners/createBannerSetting`,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      data: data,
    };

    const response = await axios.request(config);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};