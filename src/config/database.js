const { Sequelize } = require("sequelize");
require("dotenv").config();

const DATABASE_URL =
  "postgresql://postgres:ewfnVUuASohkxfVDuTcqcsYGXiMMBNDz@autorack.proxy.rlwy.net:45517/railway";

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
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
