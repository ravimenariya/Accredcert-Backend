// controllers/serviceController.js
const Service = require('../models/services');

exports.getServices = async (req, res) => {
    try {
        const data = await Service.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single service by ID
exports.getServiceById = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
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

        const newService = new Service({
            title,
            description,
            category,
            country,
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

        const updatedService = await Service.findByIdAndUpdate(
            _id,
            {
                title,
                description,
                category,
                country,
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
