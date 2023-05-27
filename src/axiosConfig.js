import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  // timeout: 5000,
  headers: {
    // 'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
