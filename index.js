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

  const errors = [];
  const where = {};

  // if (dateRange || type || medium) {
  // Prepare filtering conditions by creating `where` object in accordance with Sequelize's documentation
  if (dateRange) {
    const [fromDateString, toDateString] = dateRange.split("/");
    const fromDate = new Date(fromDateString);
    const toDate = new Date(toDateString);

    if (isNaN(fromDate) || isNaN(toDate)) {
      // If either date is invalid, create clear error message(s)
      errors.push(
        "Invalid date_range value. Make sure to follow format YYYY-MM-DD/YYYY-MM-DD."
      );
    }
    // Add 1 day to the end date, so that results include it
    toDate.setDate(toDate.getDate() + 1);

    where.datetime = {
      [Op.gte]: fromDate,
      [Op.lte]: toDate,
    };
  }

  if (type && !["consultation", "one_off"].includes(type)) {
    errors.push(
      `Invalid appointment_type: ${type}. Make sure it is one of 'consultation' or 'one_off'.`
    );
  }

  if (medium && !["video", "phone"].includes(medium)) {
    errors.push(
      `Invalid appointment_medium: ${medium}. Make sure it is one of 'video' or 'phone'.`
    );
  }
  // }

  try {
    if (errors.length) throw errors;

    const allAvailabilities = await db.Availability.findAll({ where });

    // Filter
    const availabilitiesFilteringResultPromises = allAvailabilities.map(
      async (availability) => {
        if (!type && !medium) return true;
        const counsellor = await availability.getCounsellor({
          include: [db.Type, db.Medium],
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
  } catch ({ message }) {
    const error = message.includes("timestamp")
      ? `Invalid datetime: ${datetime}. Make sure it follow format YYYY-MM-DD.`
      : `Invalid counsellor_id: ${counsellorId}. This could be because the counsellor doesn't exist or the value is not a valid id.`;

    res.status(422).json({ error });
  }
});

app.listen(PORT, () => {
  console.log(` --- Listening on port ${PORT} --- `);
});
