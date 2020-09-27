if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const { Op } = require("sequelize");

const db = require("./database/models");

const app = express();
const PORT = process.env.EXPRESS_PORT;

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Logging middleware for development/debugging
  console.log(">>> >>> >>> >>> REQUEST >>> >>> >>> >>>\n");
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

  // Check if all input values are valid
  ///////////////////////////////////////
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

    // Prepare filtering conditions by creating `where` object in accordance with Sequelize's documentation
    where.datetime = {
      [Op.gte]: fromDate,
      [Op.lte]: toDate,
    };
  }

  try {
    if (errors.length) throw errors;

    const matchingAvailabilities = await db.Availability.advancedFind({
      where,
      type,
      medium,
    });

    res.status(200).json(matchingAvailabilities);
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.post("/availabilities", async (req, res) => {
  const { counsellor_id: counsellorId, datetimes } = req.body;

  if (!counsellorId || !datetimes || !datetimes.length) {
    return res.status(400).json({
      error:
        "Missing required parameter: make sure to include `counsellor_id` and `datetimes` in body of request.",
    });
  }

  try {
    const counsellor = await db.Counsellor.findByPk(counsellorId);

    if (counsellor === null) {
      return res.status(404).json({
        error: `There is no existing counsellor with id: ${counsellorId}.`,
      });
    }

    // Check that all datetimes are valid
    datetimes.forEach((datetime) => {
      if (isNaN(new Date(datetime))) {
        return res.status(422).json({
          error: `Invalid datetime: ${datetime}.`,
        });
      }
    });

    const newAvailabilitiesPromises = datetimes.map((datetime) =>
      counsellor.createAvailability({ datetime })
    );

    const newAvailabilities = await Promise.all(newAvailabilitiesPromises);

    res.status(200).json(newAvailabilities);
  } catch (error) {
    return res.status(400).json({
      error: `Invalid counsellor_id: ${counsellorId}.`,
    });
  }
});

app.listen(PORT, () => {
  console.log(` --- Listening on port ${PORT} --- `);
});
