const express = require("express");

const db = require("./database/db");

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  // Logging middleware for development/debugging
  console.log("--- >> ", req.method, "\t", req.path);
  next();
});

app.get("/availabilities", async (req, res) => {
  const allAvailabilities = await db.Availability.findAll();
  res.json(allAvailabilities);
});

app.listen(PORT, () => {
  console.log(` --- Listening on port ${PORT} --- `);
});
