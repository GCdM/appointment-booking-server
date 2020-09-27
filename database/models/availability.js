const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = require("../db");
const Counsellor = require("./counsellor");
const Type = require("./type");
const Medium = require("./medium");

class Availability extends Model {
  static async advancedFind({ where, type, medium }) {
    const allAvailabilitiesInDateRange = await Availability.findAll({
      where,
    });

    // Due to asynchronous ORM, I filtered by getting an array of booleans, waiting for all promises to resolve, and finally filtering the Availability array by comparing against boolean array.
    // This is very inelegant and expensive. Ideally, would have used more advanced querying functionality of ORM itself.
    const availabilitiesFilteringResultPromises = allAvailabilitiesInDateRange.map(
      async (availability) => {
        if (!type && !medium) return true;

        const counsellor = await availability.getCounsellor({
          include: [Type, Medium],
        });
        const typeNames = counsellor.Types.map((t) => t.name);
        const mediaNames = counsellor.Media.map((m) => m.name);

        if (
          (type && !typeNames.includes(type)) ||
          (medium && !mediaNames.includes(medium))
        ) {
          return false;
        } else {
          return true;
        }
      }
    );

    const availabilitiesFilteringResults = await Promise.all(
      availabilitiesFilteringResultPromises
    );

    return allAvailabilitiesInDateRange.filter(
      (availability, index) => availabilitiesFilteringResults[index]
    );
  }
}

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
