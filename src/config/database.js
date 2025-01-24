const { Sequelize } = require("sequelize");
require("dotenv").config();

// Railway PostgreSQL bağlantı bilgileri
const sequelize = new Sequelize({
  dialect: "postgres",
  host: "autorack.proxy.rlwy.net",
  port: 45517,
  database: "railway",
  username: "postgres",
  password: "ewfnVUuASohkxfVDuTcqcsYGXiMMBNDz",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

// Test bağlantısı
sequelize
  .authenticate()
  .then(() => {
    console.log("Veritabanı bağlantısı başarılı.");
  })
  .catch((err) => {
    console.error("Veritabanı bağlantı hatası:", err);
  });

module.exports = sequelize;
