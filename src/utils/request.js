import axios from "axios";
import config from "./config";
import { setServerStatus } from "../Stores/server.store";
import { useProfileStore } from "../Stores/profileStore";

export const request = async (url = "", method = "GET", data = {}) => {
  const { access_token } = useProfileStore.getState();

  let headers = {
    Accept: "application/json",
    Authorization: access_token ? `Bearer ${access_token}` : "",
  };

  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await axios({
      url: config.base_url + url,
      method,
      data,
      headers,
    });
    return res.data;
  } catch (error) {
    const response = error.response;
    if (response) {
      setServerStatus(response.status);
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

      return { status: response.status, errors };
    } else {
      return {
        status: 500,
        errors: { message: error.message || "Network error" },
      };
    }
  }
};
