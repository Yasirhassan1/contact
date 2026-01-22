import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_ROOT_URL || "http://localhost:4000";

const api = axios.create({
    baseURL: API_URL,
   withCredentials: true,
});



export default api;
