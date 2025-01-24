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
  try {
    console.log("Gelen istek verisi:", req.body); // Debug için

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

    // Gelen değerlerin kontrolü
    if (!customer_id) {
      return res.status(400).json({
        success: false,
        message: "Müşteri ID gerekli",
      });
    }

    if (!fabric_price || !overhead || !commission) {
      return res.status(400).json({
        success: false,
        message: "Gerekli fiyat bilgileri eksik",
        required: {
          fabric_price: !!fabric_price,
          overhead: !!overhead,
          commission: !!commission,
        },
      });
    }

    // Sayısal değerlere çevirme
    const numericValues = {
      fabric_price: Number(fabric_price),
      lining_price: Number(lining_price || 0),
      garni_price: Number(garni_price || 0),
      labor_cost: Number(labor_cost || 0),
      overhead: Number(overhead),
      commission: Number(commission),
      profit_margin: Number(profit_margin),
      vat: Number(vat),
    };

    // Temel maliyet hesaplama
    const baseCost = [
      numericValues.fabric_price,
      numericValues.lining_price,
      numericValues.garni_price,
      numericValues.labor_cost,
    ].reduce((sum, price) => sum + price, 0);

    console.log("Temel maliyet:", baseCost); // Debug için

    // Fiyat detaylarını hesapla
    const withOverhead = baseCost * (1 + numericValues.overhead / 100);
    const withCommission = withOverhead * (1 + numericValues.commission / 100);
    const withProfit = withCommission * (1 + numericValues.profit_margin / 100);
    const vatAmount = withProfit * (numericValues.vat / 100);
    const finalPrice = withProfit + vatAmount;

    try {
      const price = await Price.create({
        customer_id,
        ...numericValues,
        final_price_tl: finalPrice,
        currency,
      });

      console.log("Kaydedilen fiyat:", price.toJSON()); // Debug için

      res.status(201).json({
        success: true,
        data: {
          ...price.toJSON(),
          baseCost,
          withOverhead,
          withCommission,
          withProfit,
          vatAmount,
          finalPrice,
        },
      });
    } catch (dbError) {
      console.error("Veritabanı kayıt hatası:", dbError);
      res.status(500).json({
        success: false,
        message: "Fiyat kaydedilirken bir hata oluştu",
        error: dbError.message,
      });
    }
  } catch (error) {
    console.error("Fiyat hesaplama hatası:", error);
    res.status(500).json({
      success: false,
      message: "Fiyat hesaplanırken bir hata oluştu",
      error: error.message,
    });
  }
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
