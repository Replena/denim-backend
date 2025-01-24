const Customer = require("../models/Customer");

exports.getAllCustomers = async (req, res) => {
  try {
    console.log("Müşteri listesi getiriliyor...");
    console.log("Customer model:", Customer);
    console.log("findAll method:", Customer.findAll);

    const customers = await Customer.findAll();
    console.log("Bulunan müşteriler:", customers);
    res.json(customers);
  } catch (error) {
    console.error("HATA - Müşteri listesi getirilirken:", error);
    res.status(500).json({
      message: "Müşteriler getirilirken bir hata oluştu",
      error: error.message,
    });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { name, country } = req.body;
    console.log("Yeni müşteri ekleniyor:", { name, country });

    const customer = await Customer.create({ name, country });
    console.log("Müşteri oluşturuldu:", customer);
    res.status(201).json(customer);
  } catch (error) {
    console.error("HATA - Müşteri oluşturulurken:", error);
    res.status(400).json({
      message: "Müşteri oluşturulurken bir hata oluştu",
      error: error.message,
    });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Müşteri güncelleniyor, ID:", id);

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Müşteri bulunamadı" });
    }

    await customer.update(req.body);
    console.log("Müşteri güncellendi:", customer);
    res.json(customer);
  } catch (error) {
    console.error("HATA - Müşteri güncellenirken:", error);
    res.status(400).json({
      message: "Müşteri güncellenirken bir hata oluştu",
      error: error.message,
    });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Müşteri siliniyor, ID:", id);

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Müşteri bulunamadı" });
    }

    await customer.destroy();
    console.log("Müşteri silindi, ID:", id);
    res.json({ message: "Müşteri başarıyla silindi" });
  } catch (error) {
    console.error("HATA - Müşteri silinirken:", error);
    res.status(500).json({
      message: "Müşteri silinirken bir hata oluştu",
      error: error.message,
    });
  }
};
