const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("Veritabanına bağlantı başarılı!");

    // Test sorgusu
    const result = await client.query("SELECT NOW()");
    console.log("Sorgu sonucu:", result.rows[0]);

    // Tabloları listele
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Mevcut tablolar:", tables.rows);

    client.release();
  } catch (err) {
    console.error("Bağlantı hatası:", err);
    console.error("Bağlantı URL:", process.env.DATABASE_URL);
  } finally {
    await pool.end();
  }
}

testConnection();
