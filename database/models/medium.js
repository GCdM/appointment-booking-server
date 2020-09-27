const { Model, DataTypes } = require("sequelize");

const sequelize = require("../db");

class Medium extends Model {}

Medium.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Medium",
  }
);

module.exports = Medium;
