import axios from "axios";
import { BACKEND_API_URL } from "./constant";
import axiosRetry from "axios-retry";

const api = axios.create({
  baseURL: BACKEND_API_URL,
});
axiosRetry(api, { retries: 2 });

export default api;
