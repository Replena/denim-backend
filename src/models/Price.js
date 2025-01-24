const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Price extends Model {}

Price.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fabric_price: DataTypes.DECIMAL(10, 2),
    lining_price: DataTypes.DECIMAL(10, 2),
    garni_price: DataTypes.DECIMAL(10, 2),
    labor_cost: DataTypes.DECIMAL(10, 2),
    overhead: DataTypes.DECIMAL(10, 2),
    commission: DataTypes.DECIMAL(5, 2),
    profit_margin: DataTypes.DECIMAL(5, 2),
    vat: DataTypes.DECIMAL(5, 2),
    final_price_tl: DataTypes.DECIMAL(12, 2),
    currency: DataTypes.STRING(3),
    calculation_date: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize,
    modelName: "Price",
    tableName: "prices",
    timestamps: false,
  }
);

module.exports = Price;
