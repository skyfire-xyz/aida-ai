import axios from "axios";
import { BACKEND_API_URL } from "./constant";

const api = axios.create({
  baseURL: BACKEND_API_URL,
});
export default api;
