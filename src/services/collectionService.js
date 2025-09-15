import { apiurl } from "../config/config";
import { getCookie } from "../config/webStorage";
import axios from "axios";
const token = getCookie("zrotoken");

export const fetchProductCollection = async () => {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${apiurl}/api/productCollection/list?page=${1}&limit=$`,
      headers: {
        Authorization: token,
      },
    };

    const response = await axios.request(config);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
