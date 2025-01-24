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
    const {
      customer_id,
      fabric_price,
      lining_price,
      garni_price,
      labor_cost,
      overhead,
      commission,
      profit_margin,
      vat,
      currency,
    } = req.body;

    // Sayısal değerleri doğrula ve dönüştür
    const numericValues = {
      fabric_price: parseFloat(fabric_price),
      lining_price: parseFloat(lining_price),
      garni_price: parseFloat(garni_price),
      labor_cost: parseFloat(labor_cost || 0), // labor_cost 0 ise varsayılan değer
      overhead: parseFloat(overhead),
      commission: parseFloat(commission),
      profit_margin: parseFloat(profit_margin),
      vat: parseFloat(vat),
    };

    // Temel maliyeti hesapla
    const baseCost =
      numericValues.fabric_price +
      numericValues.lining_price +
      numericValues.garni_price +
      numericValues.labor_cost;

    console.log("Temel maliyet:", baseCost);

    // Fiyat detaylarını hesapla
    const withOverhead = baseCost * (1 + numericValues.overhead / 100);
    const withCommission = withOverhead * (1 + numericValues.commission / 100);
    const withProfit = withCommission * (1 + numericValues.profit_margin / 100);
    const vatAmount = withProfit * (numericValues.vat / 100);
    const finalPrice = withProfit + vatAmount;

    try {
      // Veritabanına kaydetmeden önce verileri kontrol et
      console.log("Kaydedilecek veriler:", {
        customer_id,
        ...numericValues,
        final_price_tl: finalPrice,
        currency,
        calculation_date: new Date(), // Hesaplama tarihini ekle
      });

      const price = await Price.create({
        customer_id: parseInt(customer_id),
        fabric_price: numericValues.fabric_price,
        lining_price: numericValues.lining_price,
        garni_price: numericValues.garni_price,
        labor_cost: numericValues.labor_cost,
        overhead: numericValues.overhead,
        commission: numericValues.commission,
        profit_margin: numericValues.profit_margin,
        vat: numericValues.vat,
        final_price_tl: parseFloat(finalPrice.toFixed(2)),
        currency,
        calculation_date: new Date(), // Hesaplama tarihini ekle
      });

      console.log("Kaydedilen fiyat:", price.toJSON());

      // Fiyat geçmişini güncelle
      const updatedHistory = await Price.findAll({
        where: { customer_id: parseInt(customer_id) },
        include: [
          {
            model: Customer,
            attributes: ["name", "country"],
            as: "Customer",
          },
        ],
        order: [["calculation_date", "DESC"]],
      });

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
        history: updatedHistory, // Güncellenmiş fiyat geçmişini de gönder
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
