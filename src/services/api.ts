import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("fitpro_refresh_token");

      if (refreshToken) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/refresh`,
            { refreshToken }
          );
          const newToken = res.data.token;
          localStorage.setItem("fitpro_token", newToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem("fitpro_token");
          localStorage.removeItem("fitpro_refresh_token");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);