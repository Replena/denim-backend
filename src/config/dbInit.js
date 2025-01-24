const sequelize = require("./database");
const Customer = require("../models/Customer");
const Price = require("../models/Price");

async function initializeDatabase() {
  try {
    // İlişkileri kur
    Customer.hasMany(Price, { foreignKey: "customer_id" });
    Price.belongsTo(Customer, { foreignKey: "customer_id" });

    // Tabloları senkronize et (DİKKAT: force: true tüm verileri siler!)
    await sequelize.sync({ alter: true });

    console.log("Veritabanı tabloları güncellendi");

    // Örnek müşteri verileri
    const customers = await Customer.bulkCreate([
      { name: "CASABLANCA PARIS", country: "France" },
      { name: "CINQ A CEPT", country: "United States" },
      { name: "DAVID KOMA", country: "United Kingdom" },
      { name: "HELIOT EMIL", country: "Denmark" },
      { name: "MARISSA WEBB", country: "United States" },
      { name: "INTERIOR", country: "Germany" },
      { name: "GAUCHERE", country: "France" },
      { name: "LAPOINTE", country: "Canada" },
      { name: "AARON ESH", country: "United Kingdom" },
      { name: "ROBYN LYNCH", country: "Ireland" },
      { name: "ME+EM", country: "United Kingdom" },
      { name: "OTTOLINGER", country: "Germany" },
    ]);

    console.log("Müşteri verileri eklendi");

    // Örnek fiyat verileri
    await Price.bulkCreate([
      {
        customer_id: 1,
        fabric_price: 100.0,
        lining_price: 50.0,
        garni_price: 25.0,
        labor_cost: 75.0,
        overhead: 35.0,
        commission: 8.0,
        profit_margin: 20.0,
        vat: 18.0,
        final_price_tl: 450.0,
        currency: "EUR",
      },
      {
        customer_id: 2,
        fabric_price: 120.0,
        lining_price: 60.0,
        garni_price: 30.0,
        labor_cost: 80.0,
        overhead: 40.0,
        commission: 8.0,
        profit_margin: 20.0,
        vat: 18.0,
        final_price_tl: 520.0,
        currency: "USD",
      },
      {
        customer_id: 3,
        fabric_price: 90.0,
        lining_price: 45.0,
        garni_price: 22.5,
        labor_cost: 70.0,
        overhead: 32.0,
        commission: 8.0,
        profit_margin: 20.0,
        vat: 18.0,
        final_price_tl: 410.0,
        currency: "EUR",
      },
    ]);

    console.log("Fiyat verileri eklendi");
  } catch (error) {
    console.error("Veritabanı başlatma hatası:", error);
  }
}

// Scripti çalıştır
initializeDatabase();
