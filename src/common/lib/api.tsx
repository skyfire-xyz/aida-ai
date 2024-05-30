import axios from "axios";
import { BACKEND_API_URL, SKYFIRE_API_KEY } from "./constant";
import axiosRetry from "axios-retry";

const api = axios.create({
  baseURL: BACKEND_API_URL,
});
api.defaults.headers.post["skyfire-api-key"] = SKYFIRE_API_KEY;
axiosRetry(api, { retries: 2 });

export default api;
