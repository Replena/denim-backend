const { Sequelize } = require("sequelize");
require("dotenv").config();

// Railway PostgreSQL bağlantı bilgileri
const sequelize = new Sequelize({
  dialect: "postgres",
  host: "dpg-cu9mpntsvqrc73dhnbng-a",
  port: 5432,
  database: "denim",
  username: "denim_user",
  password: "EOLmGnnWzp9kUNg0rssOOEY0U11xEAvb",
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
