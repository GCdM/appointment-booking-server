const db = require("./db");
const originalData = require("../data.json");

async function setup() {
  await db.sequelize.sync({ force: true });

  for (let i = 0; i < originalData.length; i++) {
    const counsellor = originalData[i];
    const newCounsellor = await db.Counsellor.create({
      id: counsellor.counsellor_id,
      firstName: counsellor.first_name,
      lastName: counsellor.last_name,
    });

    // Create relationship with appointment Types
    counsellor.appointment_types.forEach(async (type) => {
      let newType = await db.Type.findOne({ where: { name: type } });

      if (newType === null) newType = await db.Type.create({ name: type });

      newCounsellor.addType(newType);
    });

    // Create relationship with appointment Media
    counsellor.appointment_mediums.forEach(async (medium) => {
      let newMedium = await db.Medium.findOne({ where: { name: medium } });

      if (newMedium === null)
        newMedium = await db.Medium.create({ name: medium });

      newCounsellor.addMedium(newMedium);
    });

    // Create existing availabilities
    counsellor.availability.forEach(async (availability) => {
      const newAvail = await newCounsellor.createAvailability({
        originalId: availability.id,
        counsellorId: newCounsellor.id,
        datetime: availability.datetime,
      });
    });

    console.log(`Created Counsellor ${i + 1} of ${originalData.length}`);
  }
}

setup().then(() => console.log(" --- Database Seeded --- "));
