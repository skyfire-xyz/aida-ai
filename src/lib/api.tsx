import axios from "axios";
import { SKYFIRE_API_KEY } from "../config/envs";
import axiosRetry from "axios-retry";
import { getSessionData } from "../utils/session-storage";

const api = axios.create({});
axiosRetry(api, { retries: 2 });

api.interceptors.request.use(
  (config) => {
    // Allowing to override the default API key set in the envs
    const key = getSessionData("LOCAL_SKYFIRE_API_KEY");
    config.headers["local-skyfire-api-key"] = key || SKYFIRE_API_KEY;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
