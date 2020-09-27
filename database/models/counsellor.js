const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = require("../db");

class Counsellor extends Model {}

Counsellor.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Counsellor",
  }
);

module.exports = Counsellor;
