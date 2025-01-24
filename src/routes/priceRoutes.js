const express = require("express");
const router = express.Router();
const priceController = require("../controllers/priceController");

// Fiyat hesaplama
router.post("/calculate", priceController.calculatePrice);

// Fiyat geçmişi
router.get("/history", priceController.getPriceHistory);

module.exports = router;
