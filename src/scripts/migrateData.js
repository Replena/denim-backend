const { Pool } = require("pg");
require("dotenv").config();

const sourcePool = new Pool({
  // Mevcut veritabanı bağlantı bilgileri
  connectionString: "eski_veritabani_url",
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

const targetPool = new Pool({
  // Render veritabanı bağlantı bilgileri
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

async function migrateData() {
  try {
    // Customers tablosunu aktar
    const customers = await sourcePool.query("SELECT * FROM customers");
    for (const customer of customers.rows) {
      await targetPool.query(
        "INSERT INTO customers (id, name, country, email, phone, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          customer.id,
          customer.name,
          customer.country,
          customer.email,
          customer.phone,
          customer.created_at,
          customer.updated_at,
        ]
      );
    }

    // Prices tablosunu aktar
    const prices = await sourcePool.query("SELECT * FROM prices");
    for (const price of prices.rows) {
      await targetPool.query(
        "INSERT INTO prices (id, customer_id, fabric_price, lining_price, garni_price, labor_cost, overhead, commission, profit_margin, vat, final_price_tl, currency, calculation_date, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)",
        [
          price.id,
          price.customer_id,
          price.fabric_price,
          price.lining_price,
          price.garni_price,
          price.labor_cost,
          price.overhead,
          price.commission,
          price.profit_margin,
          price.vat,
          price.final_price_tl,
          price.currency,
          price.calculation_date,
          price.created_at,
          price.updated_at,
        ]
      );
    }

    console.log("Veri aktarımı başarılı!");
  } catch (error) {
    console.error("Veri aktarımı hatası:", error);
  } finally {
    await sourcePool.end();
    await targetPool.end();
  }
}

migrateData();
