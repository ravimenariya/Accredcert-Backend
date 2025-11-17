const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    // reference to canonical Country
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
    category: String,
    imageUrl: String,
    isActive: Boolean,
    createdAt: Date,
    updatedAt: Date
});

module.exports = mongoose.model('Service', serviceSchema);
