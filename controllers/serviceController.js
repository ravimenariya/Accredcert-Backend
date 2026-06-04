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

const isObjectIdLike = (value) => {
    if (!value) return false;
    if (typeof value === 'string') return /^[a-fA-F0-9]{24}$/.test(value);
    return value && typeof value === 'object' && value.constructor && value.constructor.name === 'ObjectId';
};

// Supports both legacy string country values and populated Country refs.
const extractCountryName = (countryValue) => {
    if (!countryValue) return "";
    if (typeof countryValue === 'string') return countryValue;
    if (countryValue && typeof countryValue === 'object' && countryValue.name) {
        return String(countryValue.name);
    }
    return "";
};

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
        const data = await Service.find().lean();

        const countryIds = Array.from(
            new Set(
                data
                    .map((s) => s.country)
                    .filter((value) => isObjectIdLike(value))
                    .map((value) => String(value))
            )
        );

        const countryDocs = countryIds.length
            ? await Country.find({ _id: { $in: countryIds } }, 'name').lean()
            : [];

        const countryMap = new Map(countryDocs.map((c) => [String(c._id), c.name]));

        // Transform to always return a country name string for frontend compatibility.
        const transformed = data.map((obj) => {
            const rawCountry = obj.country;
            if (typeof rawCountry === 'string') {
                obj.country = rawCountry;
            } else if (rawCountry && typeof rawCountry === 'object' && rawCountry.name) {
                obj.country = String(rawCountry.name);
            } else if (isObjectIdLike(rawCountry)) {
                obj.country = countryMap.get(String(rawCountry)) || "";
            } else {
                obj.country = "";
            }
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
        const service = await Service.findById(id).lean();
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        const obj = { ...service };
        const rawCountry = obj.country;

        if (typeof rawCountry === 'string') {
            obj.country = rawCountry;
        } else if (rawCountry && typeof rawCountry === 'object' && rawCountry.name) {
            obj.country = String(rawCountry.name);
        } else if (isObjectIdLike(rawCountry)) {
            const countryDoc = await Country.findById(rawCountry, 'name').lean();
            obj.country = countryDoc?.name || "";
        } else {
            obj.country = "";
        }

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
