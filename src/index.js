require("dotenv").config();
const express = require("express");
const cors = require("cors");
const customerRoutes = require("./routes/customerRoutes");
const db = require("./config/database");
const priceRoutes = require("./routes/priceRoutes");

const app = express();

// CORS ayarları
app.use(
  cors({
    origin: [
      "https://denim-frontend.vercel.app",
      "https://denim-frontend-git-main-replenas-projects.vercel.app",
      "https://denim-frontend-1w1aptyrw-replenas-projects.vercel.app",
      "https://denim-frontend-*-replenas-projects.vercel.app", // Wildcard pattern
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
  })
);

// Pre-flight istekleri için
app.options("*", cors());

// JSON parse
app.use(express.json());

// Loglama middleware'i
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Ana route
app.get("/", (req, res) => {
  res.json({ message: "API çalışıyor" });
});

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/prices", priceRoutes);

const PORT = process.env.PORT || 8081;

// Veritabanı bağlantısı ve sunucuyu başlat
console.log("Uygulama başlatılıyor...");

db.authenticate()
  .then(() => {
    console.log("Veritabanı bağlantısı başarılı");

    // HTTP sunucusunu başlat
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Sunucu ${PORT} portunda çalışıyor`);
      console.log("Environment:", process.env.NODE_ENV);
      console.log("CORS origins:", app.get("cors").origin);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM sinyali alındı. Sunucu kapatılıyor...");
      server.close(() => {
        console.log("Sunucu kapatıldı");
        process.exit(0);
      });
    });

    // Beklenmeyen hatalar için
    process.on("uncaughtException", (error) => {
      console.error("Beklenmeyen hata:", error);
      server.close(() => {
        console.log("Sunucu hata nedeniyle kapatıldı");
        process.exit(1);
      });
    });
  })
  .catch((err) => {
    console.error("Veritabanı bağlantı hatası:", err);
    process.exit(1);
  });

// Global hata yakalama
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Hata:`, err);
  res.status(500).json({
    success: false,
    message: "Sunucuda bir hata oluştu",
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Sayfa bulunamadı",
  });
});
