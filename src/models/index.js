const Customer = require("./Customer");
const Price = require("./Price");

// İlişkileri burada tanımlayın
Price.belongsTo(Customer, {
  foreignKey: "customer_id",
  as: "Customer",
});

Customer.hasMany(Price, {
  foreignKey: "customer_id",
  as: "Prices",
});

module.exports = {
  Customer,
  Price,
};
