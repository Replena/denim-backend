const { Sequelize } = require("sequelize");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set!");
  process.exit(1);
}

console.log(
  "Trying to connect to database with URL:",
  process.env.DATABASE_URL
);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: console.log, // Geçici olarak logging'i açalım
});

// Test bağlantısı
sequelize
  .authenticate()
  .then(() => {
    console.log("Veritabanı bağlantısı başarılı.");
  })
  .catch((err) => {
    console.error("Veritabanı bağlantı hatası:", err);
    console.error("Bağlantı detayları:", {
      host: sequelize.config.host,
      port: sequelize.config.port,
      database: sequelize.config.database,
      username: sequelize.config.username,
    });
  });

module.exports = sequelize;
