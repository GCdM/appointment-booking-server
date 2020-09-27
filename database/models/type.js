const { Model, DataTypes } = require("sequelize");

const sequelize = require("../db");

class Type extends Model {}

Type.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Type",
  }
);

module.exports = Type;
