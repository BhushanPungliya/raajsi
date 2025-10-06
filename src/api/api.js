import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-orpin-nu-20.vercel.app",
  withCredentials: true,         
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
