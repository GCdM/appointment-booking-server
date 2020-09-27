const Counsellor = require("./counsellor");
const Availability = require("./availability");
const Type = require("./type");
const Medium = require("./medium");

Counsellor.hasMany(Availability, { foreignKey: "counsellorId" });
Availability.belongsTo(Counsellor, { foreignKey: "counsellorId" });

Counsellor.belongsToMany(Type, { through: "CounsellorType" });
Type.belongsToMany(Counsellor, { through: "CounsellorType" });

Counsellor.belongsToMany(Medium, { through: "CounsellorMedium" });
Medium.belongsToMany(Counsellor, { through: "CounsellorMedium" });

module.exports = {
  Counsellor,
  Availability,
  Type,
  Medium,
};
