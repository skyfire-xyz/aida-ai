import axios from "axios";
import { BACKEND_API_URL, SKYFIRE_API_KEY } from "./constant";
import axiosRetry from "axios-retry";
import { getSessionData } from "./utils";

const api = axios.create({
  baseURL: BACKEND_API_URL,
});
axiosRetry(api, { retries: 2 });

api.interceptors.request.use(
  (config) => {
    const key = getSessionData("LOCAL_SKYFIRE_API_KEY");
    config.headers["skyfire-api-key"] = key || SKYFIRE_API_KEY;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
