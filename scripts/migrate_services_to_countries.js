#!/usr/bin/env node
/**
 * Migrate existing Service.country string values into Country documents
 * and update Service.country to reference the Country._id.
 *
 * Usage: node scripts/migrate_services_to_countries.js
 */
const connectDB = require('../config/db');
const Service = require('../models/services');
const Country = require('../models/country');

const toTitleCase = (str) =>
  String(str || "")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");

async function run() {
  await connectDB();
  try {
    const distinct = await Service.distinct('country', { country: { $nin: [null, '', undefined] } });
    console.log(`Found ${distinct.length} distinct country values.`);

    for (const raw of distinct) {
      try {
        const cleaned = toTitleCase(raw);
        let countryDoc = await Country.findOne({ name: { $regex: `^${cleaned}$`, $options: 'i' } });
        if (!countryDoc) {
          countryDoc = await Country.create({ name: cleaned });
          console.log(`Created country: ${cleaned}`);
        }
        // update services having this raw country string to reference the new country id
        const res = await Service.updateMany({ country: raw }, { country: countryDoc._id });
        console.log(`Updated ${res.modifiedCount || res.nModified || 0} services for country '${raw}'`);
      } catch (e) {
        console.error('Error processing country', raw, e.message || e);
      }
    }

    console.log('Migration completed.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
