const express = require("express");
const bodyParser = require("body-parser");
const { Op } = require("sequelize");

const db = require("./database/db");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Logging middleware for development/debugging
  console.log("\n>>> >>> >>> >>> REQUEST >>> >>> >>> >>>\n");
  console.log(req.method, "\t", req.path);
  if (req.method === "GET") {
    console.log("\nreq.query: ", req.query);
  } else {
    console.log("\nreq.body: ", req.body);
  }
  console.log("\n<<< <<< <<< <<< <<< <<< <<< <<< <<< <<<");

  next();
});

app.get("/availabilities", async (req, res) => {
  const {
    date_range: dateRange,
    appointment_type: type,
    appointment_medium: medium,
  } = req.query;

  const where = {};

  // if (dateRange || type || medium) {
  // Prepare filtering conditions by creating `where` object in accordance with Sequelize's documentation
  if (dateRange) {
    const [fromDate, toDate] = dateRange.split("/");

    where.datetime = {
      [Op.gt]: new Date(fromDate),
      [Op.lt]: new Date(toDate),
    };
  }
  // }

  try {
    const allAvailabilities = await db.Availability.findAll({ where });

    // Filter
    const availabilitiesFilteringResultPromises = allAvailabilities.map(
      async (availability) => {
        if (!type && !medium) return true;

        const counsellor = await availability.getCounsellor();
        const counsellorTypes = await counsellor.getTypes();
        const types = counsellorTypes.map((t) => t.name);
        const counsellorMedia = await counsellor.getMedia();
        const media = counsellorMedia.map((m) => m.name);

        if (
          (type && !types.includes(type)) ||
          (medium && !media.includes(medium))
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

    const availabilitiesByTypeAndMedium = allAvailabilities.filter(
      (availability, index) => availabilitiesFilteringResults[index]
    );

    res.status(200).json(availabilitiesByTypeAndMedium);
  } catch (error) {
    res.status(400).json({ error });
  }
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
