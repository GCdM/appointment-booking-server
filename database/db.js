const { Sequelize } = require("sequelize");

// Connect to DB
console.log("Connecting to database...");

const sequelize = new Sequelize(
  process.env.SEQUELIZE_DB_NAME,
  process.env.SEQUELIZE_DB_USER,
  process.env.SEQUELIZE_DB_PASSWORD,
  {
    host: "localhost",
    port: process.env.SEQUELIZE_DB_CONN_PORT,
    dialect: process.env.SEQUELIZE_DB_DIALECT,
    logging: false,
  }
);

sequelize.authenticate().then(() => {
  console.log("Successfully connected to database!");
});

module.exports = sequelize;
