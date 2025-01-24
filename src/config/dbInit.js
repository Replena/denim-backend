const sequelize = require("./database");
const Customer = require("../models/Customer");
const Price = require("../models/Price");

async function initializeDatabase() {
  try {
    // İlişkileri kur
    Customer.hasMany(Price, { foreignKey: "customer_id" });
    Price.belongsTo(Customer, { foreignKey: "customer_id" });

    // Tabloları senkronize et (force: true ile tabloları sil ve yeniden oluştur)
    await sequelize.sync({ force: true });

    console.log("Veritabanı tabloları yeniden oluşturuldu");

    // Örnek müşteri verileri (aynı isimler)
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

    // Geçmiş tarihli örnek fiyat verileri
    const pastDates = [
      new Date("2024-01-15"),
      new Date("2024-01-10"),
      new Date("2024-01-05"),
      new Date("2023-12-28"),
      new Date("2023-12-20"),
      new Date("2023-12-15"),
    ];

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
        calculation_date: pastDates[0],
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
        calculation_date: pastDates[1],
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
        calculation_date: pastDates[2],
      },
      {
        customer_id: 1,
        fabric_price: 95.0,
        lining_price: 48.0,
        garni_price: 24.0,
        labor_cost: 72.0,
        overhead: 34.0,
        commission: 8.0,
        profit_margin: 20.0,
        vat: 18.0,
        final_price_tl: 430.0,
        currency: "EUR",
        calculation_date: pastDates[3],
      },
      {
        customer_id: 2,
        fabric_price: 115.0,
        lining_price: 58.0,
        garni_price: 29.0,
        labor_cost: 78.0,
        overhead: 38.0,
        commission: 8.0,
        profit_margin: 20.0,
        vat: 18.0,
        final_price_tl: 500.0,
        currency: "USD",
        calculation_date: pastDates[4],
      },
      {
        customer_id: 3,
        fabric_price: 85.0,
        lining_price: 43.0,
        garni_price: 21.0,
        labor_cost: 68.0,
        overhead: 31.0,
        commission: 8.0,
        profit_margin: 20.0,
        vat: 18.0,
        final_price_tl: 390.0,
        currency: "EUR",
        calculation_date: pastDates[5],
      },
    ]);

    console.log("Geçmiş tarihli fiyat verileri eklendi");
  } catch (error) {
    console.error("Veritabanı başlatma hatası:", error);
  }
}

// Scripti çalıştır
initializeDatabase();
