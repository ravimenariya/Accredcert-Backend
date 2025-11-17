// controllers/serviceController.js
const Service = require('../models/services');
const Country = require('../models/country');

// Helpers
const toTitleCase = (str) =>
    String(str || "")
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
        .join(" ");

// Find existing country (case-insensitive) or create it, return Country document
const findOrCreateCountry = async (name) => {
    if (!name) return null;
    const cleaned = toTitleCase(name);
    try {
        const existing = await Country.findOne({ name: { $regex: `^${cleaned}$`, $options: 'i' } });
        if (existing) return existing;
        const created = await Country.create({ name: cleaned });
        return created;
    } catch (err) {
        // On error return a Country-like object with name only
        return { _id: null, name: cleaned };
    }
};

exports.getServices = async (req, res) => {
    try {
        const data = await Service.find().populate('country', 'name');
        // transform to return country as name string for compatibility
        const transformed = data.map((s) => {
            const obj = s.toObject();
            obj.country = s.country && s.country.name ? s.country.name : "";
            return obj;
        });
        res.status(200).json(transformed);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get distinct countries from services
exports.getCountries = async (req, res) => {
    try {
        const countries = await Country.find({}, 'name').sort({ name: 1 }).lean();
        res.status(200).json(countries.map((c) => c.name));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single service by ID
exports.getServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const service = await Service.findById(id).populate('country', 'name');
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        const obj = service.toObject();
        obj.country = service.country && service.country.name ? service.country.name : "";
        res.status(200).json(obj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json({ message: "Service deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addservice = async (req, res) => {
    try {
        const { title, description, category, country, isActive, createdAt, updatedAt, imageUrl } = req.body;

        // find or create canonical country doc
        const countryDoc = await findOrCreateCountry(country);

        const newService = new Service({
            title,
            description,
            category,
            country: countryDoc ? countryDoc._id : null,
            isActive,
            createdAt: createdAt || new Date(),
            updatedAt: updatedAt || new Date(),
            imageUrl
        });

        await newService.save();

        res.status(201).json({ message: "Service added successfully", service: newService });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editservice = async (req, res) => {
    try {
        const { _id, title, description, category, country, isActive, createdAt, updatedAt, imageUrl } = req.body;

        if (!_id) {
            return res.status(400).json({ message: "Service ID is required" });
        }

        // find or create canonical country doc
        const countryDoc = await findOrCreateCountry(country);

        const updatedService = await Service.findByIdAndUpdate(
            _id,
            {
                title,
                description,
                category,
                country: countryDoc ? countryDoc._id : null,
                isActive,
                createdAt,
                updatedAt,
                imageUrl
            },
            { new: true }
        );

        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json({
            message: "Service updated successfully ✅",
            data: updatedService
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
