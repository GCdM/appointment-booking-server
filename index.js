const express = require("express");

const db = require("./database/db");

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  // Logging middleware for development/debugging
  console.log("--- >> ", req.method, "\t", req.path);
  next();
});

app.get("/availabilities", (req, res) => {
  res.send("Testing");
});

app.listen(PORT, () => {
  console.log(` --- Listening on port ${PORT} --- `);
});
