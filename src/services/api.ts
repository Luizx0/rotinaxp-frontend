import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ?? "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("rotinaxp.auth.session");

  if (!token) {
    return config;
  }

  try {
    const parsedToken = JSON.parse(token) as { token?: string };

    if (parsedToken.token) {
      config.headers.Authorization = `Bearer ${parsedToken.token}`;
    }
  } catch {
    return config;
  }

  return config;
});

export default api;
