import axios from "axios";
import { apiurl } from "./config.js";
export const validateToken = async (token) => {
  try {
    const response = await axios.post(
      `${apiurl}/api/users/verifyuser`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(response)
    if (response.data?.success === true) {
      return response.data;
    } else {
      throw new Error("Token validation failed - Response not successful");
    }
  } catch (error) {
    console.error("Token validation error:", error);
    throw new Error("Token validation failed");
  }
};
