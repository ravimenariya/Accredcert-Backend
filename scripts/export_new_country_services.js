#!/usr/bin/env node
/**
 * Usage: node scripts/export_new_country_services.js
 * Exports services that have country equal to '__new' (or empty) to a JSON file
 * so an admin can review and correct them.
 */
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const Service = require('../models/services');

async function run() {
  await connectDB();
  try {
    const results = await Service.find({ $or: [{ country: '__new' }, { country: null }, { country: '' }] }).lean();
    const outPath = path.resolve(__dirname, 'services__new_export.json');
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    console.log(`Exported ${results.length} services to ${outPath}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
