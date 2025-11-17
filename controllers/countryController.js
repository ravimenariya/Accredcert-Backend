const Country = require('../models/country');
const Service = require('../models/services');

exports.listCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort({ name: 1 }).lean();
    res.status(200).json(countries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCountry = async (req, res) => {
  try {
    const { name, code } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const existing = await Country.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existing) return res.status(409).json({ message: 'Country already exists', country: existing });
    const created = await Country.create({ name: name.trim() , code });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update name
exports.updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const updated = await Country.findByIdAndUpdate(id, { name: name.trim() }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Country not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Merge source into target: update services and delete source country
exports.mergeCountries = async (req, res) => {
  try {
    const { sourceId, targetId } = req.body;
    if (!sourceId || !targetId) return res.status(400).json({ message: 'sourceId and targetId required' });
    if (sourceId === targetId) return res.status(400).json({ message: 'source and target must differ' });

    const target = await Country.findById(targetId);
    if (!target) return res.status(404).json({ message: 'Target country not found' });

    // Reassign services
    const result = await Service.updateMany({ country: sourceId }, { country: targetId });

    // Delete source country
    await Country.findByIdAndDelete(sourceId);

    res.status(200).json({ message: 'Merged', modifiedCount: result.modifiedCount || result.nModified || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    // Prevent deletion if services reference this country
    const count = await Service.countDocuments({ country: id });
    if (count > 0) return res.status(400).json({ message: 'Cannot delete country referenced by services' });
    await Country.findByIdAndDelete(id);
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
