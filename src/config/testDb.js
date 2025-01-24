const sequelize = require("./database");

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Veritabanı bağlantısı başarılı.");

    // Tabloları senkronize et
    await sequelize.sync({ force: false });
    console.log("Tablolar senkronize edildi.");
  } catch (error) {
    console.error("Bağlantı hatası:", error);
  }
}

testConnection();
