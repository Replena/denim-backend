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
  (response) => response,
  (error) => {
    if (error.response) {
      // Sunucu yanıt verdi ama hata kodu döndü
      console.error(
        "Sunucu hatası:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // İstek yapıldı ama yanıt alınamadı
      console.error("Ağ hatası:", error.message);
    } else {
      // İstek oluşturulurken hata oluştu
      console.error("İstek hatası:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
