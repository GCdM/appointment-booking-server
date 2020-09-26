const express = require("express");
const bodyParser = require("body-parser");

const db = require("./database/db");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Logging middleware for development/debugging
  console.log("\n>>> >>> >>> >>> REQUEST >>> >>> >>> >>>\n");
  console.log(req.method, "\t", req.path);
  if (req.method !== "GET") console.log("\nreq.body: ", req.body);
  console.log("\n<<< <<< <<< <<< <<< <<< <<< <<< <<< <<<");
  next();
});

app.get("/availabilities", async (req, res) => {
  const allAvailabilities = await db.Availability.findAll();

  res.status(200).json(allAvailabilities);
});

app.post("/availabilities", async (req, res) => {
  const { counsellorId, datetime } = req.body;

  try {
    const newAvailability = await db.Availability.create({
      counsellorId,
      datetime,
    });

    res.status(200).json(newAvailability);
  } catch (error) {
    res.status(422).json({ error });
  }
});

app.listen(PORT, () => {
  console.log(` --- Listening on port ${PORT} --- `);
});
