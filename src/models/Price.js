const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Price = sequelize.define(
  "Price",
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
    fabric_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    lining_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    garni_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    labor_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    overhead: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    commission: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    profit_margin: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    vat: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    final_price_tl: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    calculation_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "prices",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Price;
