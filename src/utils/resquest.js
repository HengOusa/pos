import axios from "axios";
import { useProfileStore } from "../Stores/profileStore";
import config from "./config";

export const request = async (url = "", method = "", data = {}) => {
  let { access_token } = useProfileStore.getState();
  // Determine proper headers
  let headers = {
    Accept: "application/json",
    Authorization: "Bearer " + access_token,
  };

  // If FormData → DO NOT manually set Content-Type
  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  try {
    const res = await axios({
      url: config.base_url + url,
      method: method,
      data: data,
      headers,
    });
    return res.data;
  } catch (error) {
    console.error(error);

    const response = error.response;

    if (response) {
      const status = response.status;
      const data = response.data;
      let errors = { message: data?.message || "Something went wrong." };
      if (data.errors) {
        Object.keys(data.errors).forEach((key) => {
          errors[key] = {
            help: data.errors[key][0],
            validateStatus: "error",
            hasFeedback: true,
          };
        });
      }

      return { status, errors };
    } else {
      return {
        status: 500,
        errors: { message: error.message || "Network error" },
      };
    }
  }
};
