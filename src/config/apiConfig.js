import axios from "axios";

const API_BASE_URL = "https://web-production-cfc0.up.railway.app";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// İstek interceptor'ı
apiClient.interceptors.request.use(
  (config) => {
    console.log("Gönderilen istek:", config); // Debug için
    return config;
  },
  (error) => {
    console.error("İstek hatası:", error);
    return Promise.reject(error);
  }
);

// Yanıt interceptor'ı
apiClient.interceptors.response.use(
  (response) => {
    console.log("Alınan yanıt:", response); // Debug için
    return response;
  },
  (error) => {
    console.error(
      "API Hatası:",
      error.response?.status,
      "-",
      error.response?.data?.message
    );
    return Promise.reject(error);
  }
);

export default apiClient;
