const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = require("../db");
const Counsellor = require("./counsellor");

class Availability extends Model {}

Availability.init(
  {
    originalId: {
      type: DataTypes.STRING,
    },
    counsellorId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: Counsellor,
        key: "id",
      },
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Availability",
  }
);

module.exports = Availability;
