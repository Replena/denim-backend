CREATE DATABASE textile_db;

\c textile_db;

-- Müşteri bilgilerini tutan tablo
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL
);

-- Fiyat hesaplamalarını tutan tablo
CREATE TABLE IF NOT EXISTS prices (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  fabric_price DECIMAL(10,2) NOT NULL,
  lining_price DECIMAL(10,2) NOT NULL,
  garni_price DECIMAL(10,2) NOT NULL,
  labor_cost DECIMAL(10,2) NOT NULL,
  overhead DECIMAL(10,2) NOT NULL,
  commission DECIMAL(10,2) NOT NULL,
  profit_margin DECIMAL(10,2) NOT NULL,
  vat DECIMAL(10,2) NOT NULL,
  final_price_tl DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  calculation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 