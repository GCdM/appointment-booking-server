const { Sequelize } = require("sequelize");

// Connect to DB
console.log("Connecting to database...");

const sequelize = new Sequelize(
  "appointment_booking_service_development",
  "postgres",
  undefined,
  {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    logging: false,
  }
);

sequelize.authenticate().then(() => {
  console.log("Successfully connected to database!");
});

module.exports = sequelize;
