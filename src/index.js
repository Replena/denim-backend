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
      "https://denim-frontend-1fpnqphb5-replenas-projects.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// JSON parse
app.use(express.json());

// Ana route
app.get("/", (req, res) => {
  res.json({ message: "API çalışıyor" });
});

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/prices", priceRoutes);

const PORT = process.env.PORT || 8081;

// Veritabanı bağlantısı ve sunucuyu başlat
db.authenticate()
  .then(() => {
    console.log("Veritabanı bağlantısı başarılı");
    app.listen(PORT, () => {
      console.log(`Sunucu ${PORT} portunda çalışıyor`);
    });
  })
  .catch((err) => {
    console.error("Veritabanı bağlantı hatası:", err);
  });

// Hata yakalama
app.use((err, req, res, next) => {
  console.error("Sunucu hatası:", err);
  res.status(500).json({
    message: "Sunucuda bir hata oluştu",
    error: err.message,
  });
});
