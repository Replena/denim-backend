const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// Tüm müşterileri getir
router.get("/", customerController.getAllCustomers);

// Yeni müşteri ekle
router.post("/", customerController.createCustomer);

// Müşteri güncelle
router.put("/:id", customerController.updateCustomer);

// Müşteri sil
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
