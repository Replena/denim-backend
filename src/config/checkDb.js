const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: 5432,
});

async function checkDatabase() {
  try {
    const client = await pool.connect();
    console.log("Veritabanına bağlantı başarılı");

    // Public şemasındaki tabloları kontrol et
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log("Mevcut tablolar:", tables.rows);

    if (tables.rows.length > 0) {
      // Customers tablosunun yapısını kontrol et
      if (tables.rows.find((t) => t.table_name === "customers")) {
        const customersStructure = await client.query(`
          SELECT column_name, data_type, character_maximum_length
          FROM information_schema.columns 
          WHERE table_schema = 'public' AND table_name = 'customers'
          ORDER BY ordinal_position
        `);
        console.log("\nCustomers tablosu yapısı:", customersStructure.rows);
      }

      // Prices tablosunun yapısını kontrol et
      if (tables.rows.find((t) => t.table_name === "prices")) {
        const pricesStructure = await client.query(`
          SELECT column_name, data_type, numeric_precision, numeric_scale
          FROM information_schema.columns 
          WHERE table_schema = 'public' AND table_name = 'prices'
          ORDER BY ordinal_position
        `);
        console.log("\nPrices tablosu yapısı:", pricesStructure.rows);
      }
    }

    client.release();
  } catch (err) {
    console.error("Veritabanı kontrolü sırasında hata:", err);
  } finally {
    pool.end();
  }
}

checkDatabase();
