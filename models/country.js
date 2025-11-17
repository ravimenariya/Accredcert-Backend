const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Country', countrySchema);
