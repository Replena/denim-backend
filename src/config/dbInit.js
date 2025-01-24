const sequelize = require("./database");
const Customer = require("../models/customer");
const Price = require("../models/price");

async function initializeDatabase() {
  try {
    // İlişkileri kur
    Customer.hasMany(Price, { foreignKey: "customer_id", as: "Prices" });
    Price.belongsTo(Customer, { foreignKey: "customer_id", as: "Customer" });

    await sequelize.authenticate();
    console.log("Veritabanı bağlantısı başarılı.");

    await sequelize.sync({ force: false });
    console.log("Tablolar senkronize edildi.");
  } catch (error) {
    console.error("Veritabanı başlatma hatası:", error);
  }
}

initializeDatabase();
