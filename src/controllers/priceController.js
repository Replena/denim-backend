const { Price, Customer } = require("../models");

// Fiyat hesaplama yardımcı fonksiyonu
const calculatePriceDetails = (baseCost, overhead, commission, profit, vat) => {
  const withOverhead = baseCost * (1 + overhead / 100);
  const withCommission = withOverhead * (1 + commission / 100);
  const withProfit = withCommission * (1 + profit / 100);
  const vatAmount = withProfit * (vat / 100);

  return {
    withOverhead,
    withCommission,
    withProfit,
    vatAmount,
    finalPrice: withProfit + vatAmount,
  };
};

exports.calculatePrice = async (req, res) => {
  const {
    customer_id,
    fabric_price,
    lining_price,
    garni_price,
    labor_cost = 0,
    overhead,
    commission,
    profit_margin = 20,
    vat = 18,
    currency = "TRY",
    exchangeRates,
  } = req.body;

  // Temel maliyet hesaplama
  const baseCost = [fabric_price, lining_price, garni_price, labor_cost].reduce(
    (sum, price) => sum + Number(price),
    0
  );

  // Fiyat detaylarını hesapla
  const priceDetails = calculatePriceDetails(
    baseCost,
    Number(overhead),
    Number(commission),
    Number(profit_margin),
    Number(vat)
  );

  // Döviz hesaplamaları
  const finalPriceEUR = priceDetails.finalPrice / exchangeRates.EUR_TRY;
  const finalPriceUSD = priceDetails.finalPrice / exchangeRates.USD_TRY;

  // Veritabanına kaydet
  const price = await Price.create({
    customer_id,
    fabric_price,
    lining_price,
    garni_price,
    labor_cost,
    overhead,
    commission,
    profit_margin,
    vat,
    final_price_tl: priceDetails.finalPrice,
    currency,
  });

  res.status(201).json({
    ...price.toJSON(),
    baseCost,
    ...priceDetails,
    finalPriceEUR,
    finalPriceUSD,
  });
};

exports.getPriceHistory = async (req, res) => {
  const { customer_id } = req.query;

  const query = {
    include: [
      {
        model: Customer,
        attributes: ["name", "country"],
        as: "Customer",
      },
    ],
    order: [["calculation_date", "DESC"]],
  };

  if (customer_id) {
    query.where = { customer_id };
  }

  const prices = await Price.findAll(query);
  res.json(prices);
};
